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
