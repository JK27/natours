const multer = require("multer");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

/////////////////////////////////////////////////////////// MULTER
//////////////////////////////////////////// STORAGE
// DOES => Indicates the destination folder for the uploaded files and gives the file a name based on the user id, timestamp and file extension.
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/img/users");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
	},
});

//////////////////////////////////////////// FILTER
// DOES => Tests if uploaded file is an image, passing true or false to the callback function. If false, throws 400 error as only images are allowed.
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Not an image. Please upload only images.", 400), false);
	}
};

//////////////////////////////////////////// UPLOAD
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

// DOES => Allows for only one single file to be uploaded at a time.
exports.uploadUserPhoto = upload.single("photo");

/////////////////////////////////////////////////////////// FILTER OBJECT
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

/////////////////////////////////////////////////////////// GET ME
exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

/////////////////////////////////////////////////////////// CREATE USER
exports.createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not defined. Please use sign up instead.",
	});
};

/////////////////////////////////////////////////////////// UPDATE USER
exports.updateUser = exports.updateTour = factory.updateOne(User);
//////////////////////////////////////////////////////////- DELETE USER
exports.deleteUser = factory.deleteOne(User);
/////////////////////////////////////////////////////////// GET ALL USERS
exports.getAllUsers = factory.getAll(User);
/////////////////////////////////////////////////////////// UPDATE CURRENT USER
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
	// DOES => 2) ..filter out unwanted fields that are not to be updated...
	const filteredBody = filterObj(req.body, "name", "email");
	if (req.file) filteredBody.photo = req.file.filename;
	// DOES => 3) ... and updates the user document.
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

//////////////////////////////////////////////////////////- SET USER INACTIVE
exports.deleteMe = catchAsync(async (req, res, next) => {
	// DOES => It does not actually delete the user, but only set its status to active: false. Only admins can delete users.
	await User.findByIdAndUpdate(req.user.id, { active: false });
	res.status(204).json({
		status: "success",
		data: null,
	});
});
/////////////////////////////////////////////////////////// GET USER BY ID
exports.getUserById = factory.getOne(User);
