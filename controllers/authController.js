const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");

/////////////////////////////////////////////////////////// SIGN TOKEN
const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

/////////////////////////////////////////////////////////// CREATE SEND TOKEN
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	////////////////////////////////////////// COOKIES
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true, // Avoids browser to be able to access or modify cookies.
	};
	// DOES => Cookie will only be sent in secure sessions.
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

	res.cookie("jwt", token, cookieOptions);
	// DOES => Removes password from the output.
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		token,
		data: {
			User: user,
		},
	});
};

/////////////////////////////////////////////////////////// CREATE USER
/* 
In order to avoid using try-catch blocks, async function is wrapped inside catchAsync function, which returns a new anonymous function that will be assigned to signup.
This anonymous function is the one being called every time a new tour should be created using the signup handler.
As the function wrapped inside catchAsync is an async function, it will return a Promise. If the Promise is rejected, then the resulting error can be caught using .catch(next), making  that the error ends up in the globalErrorHandler middleware.
*/

// DOES => Creates a new user based on the User Model, getting the data from the body of the request (req.body). User.crate(req.body) method creates a Promise that is stored in the newUser var.
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
		role: req.body.role,
		active: req.body.active,
	});

	// DOES => Sends welcome email to the new user.
	const url = `${req.protocol}://${req.get("host")}/me`;
	await new Email(newUser, url).sendWelcome();

	// DOES => Automatically logs in user after signing up.
	createSendToken(newUser, 201, res);
});

/////////////////////////////////////////////////////////// LOG IN USER
exports.login = catchAsync(async (req, res, next) => {
	// DOES => Reads user's email and password directly from the body of the request.
	const { email, password } = req.body;

	// DOES => Checks if email and password exist...
	if (!email || !password) {
		return next(new AppError("Please provide email and password", 400));
	}
	// DOES => ... and if user exist and password is correct, ...
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password", 401));
	}
	// DOES => ... then send token to the client.
	createSendToken(user, 200, res);
});

/////////////////////////////////////////////////////////// LOG OUT
exports.logout = (req, res) => {
	res.cookie("jwt", "logged-out", {
		expires: new Date(Date.now() + 1 * 10000),
		httpOnly: true, // Avoids browser to be able to access or modify cookies.
	});
	res.status(200).json({ status: "success" });
};
/////////////////////////////////////////////////////////// PROTECT ROUTES MIDDLEWARE
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	// DOES => 1) Gets token and checks if it exists...
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
		// DOES => ... if there is no token but there is a cookie, then the token is the cookie...
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		// DOES => 2) ... if there is no token, gives 401 error...
		return next(
			new AppError(
				"You are not logged in. Please log in or sign up to get access",
				401
			)
		);
	}
	// DOES => 3) ... if token exists, then verifies the token...
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	// DOES => 4) ... and if user still exists...
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError("This user does no longer exist.", 401));
	}
	// DOES => If password has changed, then return a new error.
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("The password has been changed. Please log in again.", 401)
		);
	}
	// DOES => 5) ... and if user has not changed password after token was issued, then grant access to protected route.
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

/////////////////////////////////////////////////////////// IS LOGGED IN MIDDLEWARE
exports.isLoggedIn = async (req, res, next) => {
	// DOES => 1) checks if there is a cookie with a token...
	if (req.cookies.jwt) {
		try {
			// DOES => 2) ... if cookie exists, then verifies the token...
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);
			// DOES => 3) ... and if user still exists...
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}
			// DOES => Checks if password has changed.
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}
			// DOES => 4) ... and if user has not changed password after token was issued, then there is a logged in user.
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}
	next();
};

/////////////////////////////////////////////////////////// RESTRICT ROUTES MIDDLEWARE
// DOES => If the role of the current user (req.user) is not a role which that action is restricted to, then return error. If true, then next().
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError("You do not have permission to perform this action.", 403)
			);
		}
		next();
	};
};

/////////////////////////////////////////////////////////// FORGOT PASSWORD MIDDLEWARE
exports.forgotPassword = catchAsync(async (req, res, next) => {
	// DOES => 1) Gets user based on posted email...
	const user = await User.findOne({ email: req.body.email });
	// DOES => If user does not exit, return error.
	if (!user) {
		return next(new AppError("There is no user with that email address.", 404));
	}
	// DOES => 2) ... then generates random reset token...
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// DOES => 3) ... then sends token to user's email.
	try {
		const resetURL = `${req.protocol}://${req.get(
			"host"
		)}/api/v1/users/resetPassword/${resetToken}`;
		await new Email(user, resetURL).sendPasswordReset();

		res.status(200).json({
			status: "success",
			message: "Token sent to email.",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError(
				"There was an error sending the email. Please try again later.",
				500
			)
		);
	}
});

/////////////////////////////////////////////////////////// RESET PASSWORD MIDDLEWARE
exports.resetPassword = catchAsync(async (req, res, next) => {
	// DOES => 1) Gets user based on token...
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	// DOES => 2) ... if token has not expired and user exists, sets new password...
	if (!user) {
		return next(new AppError("Token is not valid or has expired", 400));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();
	// DOES => 3) ... updates passwordChangedAt property...

	// DOES => 4) ... logs user in and sends JWT.
	createSendToken(user, 200, res);
});

/////////////////////////////////////////////////////////// UPDATE PASSWORD MIDDLEWARE
exports.updatePassword = catchAsync(async (req, res, next) => {
	// DOES => 1) Gets user from collection...
	const user = await User.findById(req.user.id).select("+password");
	// DOES => 2) ... checks if posted current password is correct...
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError("Your current password is incorrect.", 401));
	}
	// DOES => 3) ... if true, updates password...
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();
	// DOES => 4) ... and logs in user and sends JWT.
	createSendToken(user, 200, res);
});
