const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

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
