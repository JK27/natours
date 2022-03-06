const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

////////////////////////////////////////////////////////// USER SCHEMA
const userSchema = new mongoose.Schema({
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
	////////////////////////////////////////// ROLE
	role: {
		type: String,
		enum: ["user", "guide", "lead-guide", "admin"],
		default: "user",
	},
	////////////////////////////////////////// PASSWORD
	password: {
		type: String,
		required: [true, "Please provide a password."],
		minlength: 8,
		trim: true,
		select: false,
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
	////////////////////////////////////////// PASSWORD CHANGED AT
	passwordChangedAt: {
		type: Date,
	},
	////////////////////////////////////////// PASSWORD RESET TOKEN
	passwordResetToken: {
		type: String,
	},
	////////////////////////////////////////// PASSWORD CHANGED AT
	passwordResetExpires: {
		type: Date,
	},
	////////////////////////////////////////// ACTIVE?
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

////////////////////////////////////////////////////////// PASSWORD ENCRYPTION MIDDLEWARE
userSchema.pre("save", async function (next) {
	// DOES => If password field is not modified, it moves to next function ignoring following code
	if (!this.isModified("password")) return next();
	// DOES => Encrypts the password after it is saved and sets passwordConfirm to undefined as it is no longer needed, it does not need to be persisted in the database
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

////////////////////////////////////////////////////////// PASSWORD CHANGED AT MIDDLEWARE
userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	// DOES => Makes sure that password change time stamp is before logging user back in
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

//////////////////////////////////////////// SHOW ONLY ACTIVE USERS
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

//////////////////////////////////////////// CORRECT PASSWORD INSTANCE METHOD
// DOES => Compares if password entered for login (candidatePassword) is correct, it is the same as userPassword. Needs bcrypt.compare() as userPassword is hashed.
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

//////////////////////////////////////////// CHANGED PASSWORD INSTANCE METHOD
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	// DOES => If user has changed the password, then check if passwords match.
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

//////////////////////////////////////////// CREATE PASSWORD RESET TOKEN INSTANCE METHOD
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
