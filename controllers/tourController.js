const fs = require("fs");

// DOES => Read tours data from file
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// DOES => Checks if ID is greater than number of tours, if true, ID is invalid and return 404 error
exports.checkId = (req, res, next, val) => {
	console.log(`Tour id is ${val}`);
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}
	next();
};

/////////////////////////////////////////////////////////// ROUTE HANDLERS
//////////////////////////////////////////// GET ALL TOURS ROUTE
exports.getAllTours = (req, res) => {
	// Route handler sends back all tours when user hits tours resource URL
	console.log(req.requestTime);
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours, // tours: tours
		},
	});
};

//////////////////////////////////////////// GET TOUR BY ID ROUTE
exports.getTourById = (req, res) => {
	// Route handler sends back all tours when user hits tours resource URL
	// DOES => Converts ID string into number
	const id = req.params.id * 1;
	// DOES => Searches for element whose ID is equal to the ID specified in the params
	const tour = tours.find(el => el.id === id);

	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
};

//////////////////////////////////////////// CREATE TOURS ROUTE

exports.createTour = (req, res) => {
	// Route handler sends data from client to the server
	// console.log(req.body);

	// DOES => Creates new ID by getting id from previous entry and then adding 1
	const newId = tours[tours.length - 1].id + 1;
	// DOES => Creates new tour using newId and getting the body from the request
	const newTour = Object.assign({ id: newId }, req.body);

	// DOES => Adds newTour to the tours array overwriting the file
	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		err => {
			res.status(201).json({
				status: "success",
				data: {
					tour: newTour,
				},
			});
		}
	);
};

//////////////////////////////////////////// UPDATE TOUR ROUTE
exports.updateTour = (req, res) => {
	res.status(200).json({
		status: "success",
		data: {
			tour: "<Updated tour here...>",
		},
	});
};
///////////////////////////////////////////- DELETE TOUR ROUTE
exports.deleteTour = (req, res) => {
	// Status is 204 - No content
	res.status(204).json({
		status: "success",
		data: null,
	});
};
