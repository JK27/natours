const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

/////////////////////////////////////////////////////////// CREATE USER
/* 
In order to avoid using try-catch blocks, async function is wrapped inside catchAsync function, which returns a new anonymous function that will be assigned to signup.
This anonymous function is the one being called every time a new tour should be created using the signup handler.
As the function wrapped inside catchAsync is an async function, it will return a Promise. If the Promise is rejected, then the resulting error can be caught using .catch(next), making  that the error ends up in the globalErrorHandler middleware.
*/

// DOES => Creates a new user based on the User Model, getting the data from the body of the request (req.body). User.crate(req.body) method creates a Promise that is stored in the newUser var
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		passwordChangedAt: req.body.passwordChangedAt,
	});

	// DOES => Automatically logs in user after signing up
	const token = signToken(newUser._id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			User: newUser,
		},
	});
});

/////////////////////////////////////////////////////////// LOG IN USER
exports.login = catchAsync(async (req, res, next) => {
	// DOES => Gets user's email and password directly from the body of the request
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
	// DOES => ... then send token to the client
	const token = signToken(user._id);

	res.status(200).json({
		status: "success",
		token,
	});
});

/////////////////////////////////////////////////////////// PROTECT ROUTES MIDDLEWARE
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	// DOES => 1) Gets token and checks if it exists...
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	// DOES => 2) ... if there is no token, gives 401 error...
	if (!token) {
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
	// DOES => If password has changed, then return a new error
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError("The password has been changed. Please log in again.", 401)
		);
	}
	// DOES => 5) ... and if user has not changed password after token was issued, then grant access to protected route.
	req.user = currentUser;
	next();
});
