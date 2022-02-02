const fs = require("fs");
const express = require("express");
const { report } = require("process");
const { del } = require("express/lib/application");

const app = express();

// DOES => Adds middleware that can modify incoming request data
app.use(express.json());

// DOES => Read tours data from file
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/////////////////////////////////////////////////////////// GET ALL TOURS ROUTE
const getAllTours = (req, res) => {
	// Route handler sends back all tours when user hits tours resource URL
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours, // tours: tours
		},
	});
};

/////////////////////////////////////////////////////////// GET TOUR BY ID ROUTE
const getTourById = (req, res) => {
	// Route handler sends back all tours when user hits tours resource URL
	// DOES => Converts ID string into number
	const id = req.params.id * 1;
	// DOES => Searches for element whose ID is equal to the ID specified in the params
	const tour = tours.find(el => el.id === id);

	// DOES => If ID in params doesn't match tour ID, then return 404 error
	// if (id > tours.length) {
	if (!tour) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}

	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
};

/////////////////////////////////////////////////////////// CREATE TOURS ROUTE

const createTour = (req, res) => {
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

/////////////////////////////////////////////////////////// UPDATE TOUR ROUTE
const updateTour = (req, res) => {
	// DOES => Checks if ID is greater than number of tours, if true, ID is invalid and return 404 error
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}

	res.status(200).json({
		status: "success",
		data: {
			tour: "<Updated tour here...>",
		},
	});
};
//////////////////////////////////////////////////////////- DELETE TOUR ROUTE
const deleteTour = (req, res) => {
	// DOES => Checks if ID is greater than number of tours, if true, ID is invalid and return 404 error
	if (req.params.id * 1 > tours.length) {
		return res.status(404).json({
			status: "fail",
			message: "Invalid ID",
		});
	}

	// Status is 204 - No content
	res.status(204).json({
		status: "success",
		data: null,
	});
};

/////////////////////////////////////////////////////////// APP ROUTINGS
// DOES => Create routing to determine how app responds to client request (url & http method)
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourById);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);
// SAME AS => Code refactored below

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
	.route("/api/v1/tours/:id")
	.get(getTourById)
	.patch(updateTour)
	.delete(deleteTour);

/////////////////////////////////////////////////////////// START SERVER
const port = 8000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
