const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

/////////////////////////////////////////////////////////// ROUTE HANDLERS
//////////////////////////////////////////// TOP 5 TOURS ROUTE
// DOES => Gets top 5 tours based on ratingsAverage and price
exports.aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "ratingsAverage,price";
	req.query.fields = "name,price,ratingsAverage,summary,difficulty";
	next();
};

//////////////////////////////////////////// GET ALL TOURS ROUTE
exports.getAllTours = async (req, res) => {
	try {
		///////////////////////// EXECUTE QUERY
		// DOES => Crates a new object of the APIFeatures class. In there, it passes a query object (Tour.find()) and the query string coming from Express (req.query)
		const features = new APIFeatures(Tour.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		// DOES => Awaits the result of the query to come back with all the documents that were selected
		const tours = await features.query;

		///////////////////////// SEND RESPONSE
		res.status(200).json({
			status: "success",
			results: tours.length,
			data: {
				tours,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

//////////////////////////////////////////// GET TOUR BY ID ROUTE
exports.getTourById = async (req, res) => {
	// DOES => Takes ID param from the request to find data for that specific tour, returning only the tour with that specified ID
	try {
		const tour = await Tour.findById(req.params.id);
		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};

//////////////////////////////////////////// CREATE TOUR ROUTE
// DOES => Creates a new tour based on the Tour Model, getting the data from the body of the request (req.body). Tour.crate(req.body) method creates a Promise that is stored in the newTour var
exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);

		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	} catch (err) {
		res.status(400).json({
			status: "fail",
			message: "Invalid data set",
		});
	}
};

//////////////////////////////////////////// UPDATE TOUR ROUTE
exports.updateTour = async (req, res) => {
	// DOES => Finds tour by ID and updates the body of the request, returning the new document
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
///////////////////////////////////////////- DELETE TOUR ROUTE
exports.deleteTour = async (req, res) => {
	// DOES => Finds tour by ID and deletes it, not returning any data back to the client
	try {
		const tour = await Tour.findByIdAndDelete(req.params.id);
		// Status is 204 - No content
		res.status(204).json({
			status: "success",
			data: null,
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
