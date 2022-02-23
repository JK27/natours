const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

/////////////////////////////////////////////////////////// CREATE REVIEW ROUTE
exports.setTourUserIds = (req, res, next) => {
	// DOES => If there is no tour on the reqests, get it from the URL parameter
	if (!req.body.tour) req.body.tour = req.params.tourId;
	// DOES => If there is no user on the reqests, get it from the user ID
	if (!req.body.user) req.body.user = req.user.id;
	next();
};
// DOES => Creates a new review based on the Review Model, getting the data from the body of the request (req.body). Review.crate(req.body) method creates a Promise that is stored in the newReview var.
exports.createReview = factory.createOne(Review);

/////////////////////////////////////////////////////////// UPDATE REVIEW ROUTE
exports.updateReview = factory.updateOne(Review);

//////////////////////////////////////////////////////////- DELETE REVIEW ROUTE
exports.deleteReview = factory.deleteOne(Review);

/////////////////////////////////////////////////////////// GET REVIEW BY ID ROUTE
exports.getReviewById = factory.getOne(Review);

/////////////////////////////////////////////////////////// GET ALL REVIEWS ROUTE
exports.getAllReviews = factory.getAll(Review);
