const mongoose = require("mongoose");
const validator = require("validator");

////////////////////////////////////////////////////////// USER SCHEMA

const UserSchema = new mongoose.Schema({
	////////////////////////////////////////// NAME
	name: {
		type: String,
		// DOES => Sets property as required and adds error message if false
		required: [true, "User must have a name"],
		unique: true,
	},
	////////////////////////////////////////// EMAIL
	email: {
		type: String,
		required: [true, "User must have an email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	////////////////////////////////////////// PHOTO
	photo: {
		type: String,
	},
	////////////////////////////////////////// PASSWORD
	password: {
		type: String,
		required: [true, "Please provide a password."],
		minlength: 8,
	},
	////////////////////////////////////////// PASSWORD CONFIRM
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password"],
		minlength: 8,
	},
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
