const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

/////////////////////////////////////////////////////////// TOP 5 TOURS ROUTE
// DOES => Gets top 5 tours based on ratingsAverage and price.
exports.aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "ratingsAverage,price";
	req.query.fields = "name,price,ratingsAverage,summary,difficulty";
	next();
};

/////////////////////////////////////////////////////////// GET ALL TOURS ROUTE
// DOES => Crates a new object of the APIFeatures class. In there, it passes a query object (Tour.find()) and the query string coming from Express (req.query).
exports.getAllTours = factory.getAll(Tour);

/////////////////////////////////////////////////////////// GET TOUR BY ID ROUTE
// DOES => Takes ID param from the request to find data for that specific tour, returning only the tour with that specified ID.
exports.getTourById = factory.getOne(Tour, { path: "reviews" });

/////////////////////////////////////////////////////////// CREATE TOUR ROUTE
// DOES => Creates a new tour based on the Tour Model, getting the data from the body of the request (req.body). Tour.crate(req.body) method creates a Promise that is stored in the newTour var.
exports.createTour = factory.createOne(Tour);

/////////////////////////////////////////////////////////// UPDATE TOUR ROUTE
exports.updateTour = factory.updateOne(Tour);

//////////////////////////////////////////////////////////- DELETE TOUR ROUTE
// DOES => Finds tour by ID and deletes it, not returning any data back to the client.
exports.deleteTour = factory.deleteOne(Tour);

/////////////////////////////////////////////////////////// GET TOUR STATS ROUTE
exports.getTourStats = catchAsync(async (req, res, next) => {
	const stats = await Tour.aggregate([
		{
			// DOES => Filters results that match specified properties and values.
			$match: { ratingsAverage: { $gte: 4.5 } },
		},
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: {
				avgPrice: 1,
			},
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
});

/////////////////////////////////////////////////////////// GET MONTHLY PLAN ROUTE
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year * 1; // 2021

	const plan = await Tour.aggregate([
		{
			// DOES => Deconstructs the array field startDates from the tours object returning a document for each start date of each tour.
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numTourStarts: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			$addFields: { month: "$_id" },
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: { numTourStarts: -1 },
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			plan,
		},
	});
});
