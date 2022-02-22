const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

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

/////////////////////////////////////////////////////////// UPDATE USER
exports.updateMe = catchAsync(async (req, res, next) => {
	// DOES => 1) Creates error if user posts password data...
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				"This route is not for password updates. Please use /updateMyPassword",
				400
			)
		);
	}
	// DOES => 2) ..filter out fields that are not to be updated...
	const filteredBody = filterObj(req.body, "name", "email");
	// DOES => 3) ... and updates the user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
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
