const Review = require("../models/reviewModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/////////////////////////////////////////////////////////// GET ALL REVIEWS ROUTE
exports.getAllReviews = catchAsync(async (req, res, next) => {
	let filter = {};
	// DOES => If there is a tourId in the params, then only show the reviews for that tour.
	if (req.params.tourId) filter = { tour: req.params.tourId };

	const reviews = await Review.find(filter);

	// DOES => Sends response back to the client
	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

/////////////////////////////////////////////////////////// CREATE REVIEW ROUTE
// DOES => Creates a new review based on the Review Model, getting the data from the body of the request (req.body). Review.crate(req.body) method creates a Promise that is stored in the newReview var.
exports.createReview = catchAsync(async (req, res, next) => {
	// DOES => If there is no tour on the reqests, get it from the URL parameter
	if (!req.body.tour) req.body.tour = req.params.tourId;
	// DOES => If there is no user on the reqests, get it from the user ID
	if (!req.body.user) req.body.user = req.user.id;
	const newReview = await Review.create(req.body);

	res.status(201).json({
		status: "success",
		data: {
			review: newReview,
		},
	});
});
