const Tour = require("../models/tourModel");

/////////////////////////////////////////////////////////// ROUTE HANDLERS
//////////////////////////////////////////// GET ALL TOURS ROUTE
exports.getAllTours = async (req, res) => {
	try {
		// DOES => Gets all the tours from the Tour collection and sends them as data object
		const tours = await Tour.find();

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

//////////////////////////////////////////// CREATE TOURS ROUTE
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
