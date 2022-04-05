const mongoose = require("mongoose");
const Tour = require("./tourModel");

////////////////////////////////////////////////////////// REVIEW SCHEMA
const reviewSchema = new mongoose.Schema(
	{
		////////////////////////////////////////// REVIEW
		review: {
			type: String,
			required: [true, "Review cannot be empty."],
			trim: true,
		},
		////////////////////////////////////////// RATING
		rating: {
			type: Number,
			required: [true, "Review must have a rating."],
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

/////////////////////////////////////////////////////////// INDEXES
// DOES => Prevents a user to post multiple reviews for the same tour, making the compound index tour and user unique.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/////////////////////////////////////////////////////////// MIDDLEWARE
//////////////////////////////////////////// POPULATE MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "name photo -_id",
	});

	next();
});

/////////////////////////////////////////////////////////// CALC AVERAGE RATINGS
reviewSchema.statics.calcAverageRatings = async function (tourId) {
	// DOES => Groups up the tours by tourId and then for each review for the matching ID it adds up 1 to the nRatings and adds the rating value to avgRatings.
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: "$tour",
				nRatings: { $sum: 1 },
				avgRatings: { $avg: "$rating" },
			},
		},
	]);

	// DOES => Updates the ratingsQuantity and ratingsAverage fields for that tour. If there is no reviews for that tour - only review has been deleted - then return to the default values.
	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRatings,
			ratingsAverage: stats[0].avgRatings,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
};

// DOES => Updates the tour output with new ratings when the review is created (saved).
reviewSchema.post("save", function () {
	this.constructor.calcAverageRatings(this.tour);
});

// DOES => Updates the tour output with new ratings when the review is updated or deleted.
reviewSchema.post(/^findOneAnd/, async function (doc) {
	await doc.constructor.calcAverageRatings(doc.tour);
});

/////////////////////////////////////////////////////////// MODEL DECLARATION
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
