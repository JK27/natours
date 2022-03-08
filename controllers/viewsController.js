const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/////////////////////////////////////////////////////////// GET OVERVIEW
exports.getOverview = catchAsync(async (req, res, next) => {
	// DOES => 1) Gets tour data from collection.
	const tours = await Tour.find();

	// DOES => 2) Builds the template.
	// DOES => 3) Renders the template using data from step 1.

	res.status(200).render("overview", {
		title: "Exciting tours for adventurous people",
		tours,
	});
});
/////////////////////////////////////////////////////////// GET OVERVIEW
exports.getTour = catchAsync(async (req, res, next) => {
	// DOES => Gets the data for the requested tour
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	if (!tour) {
		return next(new AppError("There is no tour with that name.", 404));
	}

	// DOES => Renders the template using data from step 1.
	res.status(200).render("tour", {
		title: `${tour.name} Tour`,
		tour,
	});
});

/////////////////////////////////////////////////////////// GET LOG IN FORM
exports.getLoginForm = (req, res) => {
	res.status(200).render("login", {
		title: "Log in",
	});
};
/////////////////////////////////////////////////////////// GET ACCOUNT
exports.getAccount = (req, res) => {
	res.status(200).render("account", {
		title: "Your account",
	});
};
/////////////////////////////////////////////////////////// GET MY TOURS
exports.getMyTours = catchAsync(async (req, res, next) => {
	// DOES => 1) Finds all bookings for current user.
	const bookings = await Booking.find({
		user: req.user.id,
	});
	// DOES => 2) Finds tours with the returned IDs
	const tourIds = bookings.map(el => el.tour);
	// DOES => Selects all the tours which have an ID included in the tourIds array.
	const tours = await Tour.find({ _id: { $in: tourIds } });

	res.status(200).render("overview", {
		title: "My tours",
		tours,
	});
});
/////////////////////////////////////////////////////////// UPDATE USER DATA
exports.updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.status(200).render("account", {
		title: "Your account",
		user: updatedUser,
	});
});
