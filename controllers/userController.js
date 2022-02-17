const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
/////////////////////////////////////////////////////////// GET ALL USERS
exports.getAllUsers = catchAsync(async (req, res) => {
	// DOES => Awaits the result of the query to come back with all the documents that were selected
	const users = await User.find();

	//////////////////////////////////////// SEND RESPONSE
	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
});

/////////////////////////////////////////////////////////// GET USER BY ID
exports.getUserById = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defined.",
	});
};

//////////////////////////////////////////// CREATE USER
exports.createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defined.",
	});
};

//////////////////////////////////////////// UPDATE USER
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defined.",
	});
};

///////////////////////////////////////////- DELETE USER
exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not yet defined.",
	});
};
