const mongoose = require("mongoose");

////////////////////////////////////////////////////////// REVIEW SCHEMA
const reviewSchema = new mongoose.Schema(
	{
		////////////////////////////////////////// REVIEW
		review: {
			type: String,
			required: [true, "Review cannot be empty."],
			trim: true,
			maxlength: 100,
		},
		////////////////////////////////////////// RATING
		rating: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be above 1.0"],
			max: [5, "Rating must be below 5.1"],
		},
		////////////////////////////////////////// CREATED AT
		createdAt: {
			type: Date,
			default: Date.now(), // Mongoose automatically converts it to current date.
		},
		////////////////////////////////////////// TOUR
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: "Tour",
			required: [true, "Review must belong to a tour"],
		},
		////////////////////////////////////////// USER
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Review must belong to a user"],
		},
	},
	////////////////////////////////////////// OPTIONS
	// DOES => Ensures that virtual properties, fields that are not stored in the database but calculated using some other value, also show up in the output.
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/////////////////////////////////////////////////////////// MIDDLEWARE
//////////////////////////////////////////// POPULATE MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "name photo -_id",
	});

	next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
