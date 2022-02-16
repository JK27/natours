const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");

/////////////////////////////////////////////////////////// CREATE USER
/* 
	In order to avoid using try-catch blocks, async function is wrapped inside catchAsync function, which returns a new anonymous function that will be assigned to signup.
	This anonymous function is the one being called every time a new tour should be created using the signup handler.
	As the function wrapped inside catchAsync is an async function, it will return a Promise. If the Promise is rejected, then the resulting error can be caught using .catch(next), making  that the error ends up in the globalErrorHandler middleware.
*/

// DOES => Creates a new user based on the User Model, getting the data from the body of the request (req.body). User.crate(req.body) method creates a Promise that is stored in the newUser var

exports.signup = catchAsync(async (req, res, next) => {
	const newUSer = await User.create(req.body);

	res.status(201).json({
		status: "success",
		data: {
			User: newUSer,
		},
	});
});
