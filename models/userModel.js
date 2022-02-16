const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

////////////////////////////////////////////////////////// USER SCHEMA

const UserSchema = new mongoose.Schema({
	////////////////////////////////////////// NAME
	name: {
		type: String,
		// DOES => Sets property as required and adds error message if false
		required: [true, "User must have a name"],
		trim: true,
	},
	////////////////////////////////////////// EMAIL
	email: {
		type: String,
		required: [true, "User must have an email"],
		unique: true,
		lowercase: true,
		trim: true,
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
		trim: true,
	},
	////////////////////////////////////////// PASSWORD CONFIRM
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password"],
		minlength: 8,
		trim: true,
		validate: {
			// NOTE => Only works on CREATE and SAVE!!!
			validator: function (el) {
				return el === this.password;
			},
			message: "Passwords are not the same.",
		},
	},
});

////////////////////////////////////////////////////////// PASSWORD ENCRYPTION MIDDLEWARE
UserSchema.pre("save", async function (next) {
	// DOES => If password field is not modified, it moves to next function ignoring following code
	if (!this.isModified("password")) return next();
	// DOES => Encrypts the password after it is saved and sets passwordConfirm to undefined as it is no longer needed, it does not need to be persisted in the database
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
