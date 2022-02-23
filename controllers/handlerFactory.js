const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("./../utils/appError");

/////////////////////////////////////////////////////////// CREATE ONE
/* 
	In order to avoid using try-catch blocks, async function is wrapped inside catchAsync function, which returns a new anonymous function that will be assigned to createOne.
	This anonymous function is the one being called every time a new tour should be created using the createOne handler.
	As the function wrapped inside catchAsync is an async function, it will return a Promise. If succesful, it will return the data.
*/
exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: "success",
			data: {
				data: doc,
			},
		});
	});

/////////////////////////////////////////////////////////// UPDATE ONE
exports.updateOne = Model =>
	catchAsync(async (req, res, next) => {
		// DOES => Finds tour by ID and updates the body of the request, returning the new document.
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				data: doc,
			},
		});
	});

//////////////////////////////////////////////////////////- DELETE ONE
exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		// DOES => Finds tour by ID and deletes it, not returning any data back to the client.
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError("No document found with that ID", 404));
		}

		// Status is 204 - No content.
		res.status(204).json({
			status: "success",
			data: null,
		});
	});

/////////////////////////////////////////////////////////// GET ONE
exports.getOne = (Model, populateOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (populateOptions) query = query.populate(populateOptions);
		const doc = await query;

		if (!doc) {
			return next(new AppError("No document found with that ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: {
				data: doc,
			},
		});
	});

/////////////////////////////////////////////////////////// GET ALL
exports.getAll = Model =>
	catchAsync(async (req, res, next) => {
		// NOTE => To allow for nested GET reviews on tour.
		let filter = {};
		// DOES => If there is a tourId in the params, then only show the reviews for that tour.
		if (req.params.tourId) filter = { tour: req.params.tourId };
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		// DOES => Awaits the result of the query to come back with all the documents that were selected.
		const doc = await features.query;

		//////////////////////////////////////// SEND RESPONSE
		res.status(200).json({
			status: "success",
			results: doc.length,
			data: {
				dat: doc,
			},
		});
	});
