const fs = require("fs");
const express = require("express");

const app = express();

// DOES => Adds middleware that can modify incoming request data
app.use(express.json());

/* ---------------------------------------------------
// DOES => Create routing to determine how app responds to client request (url & http method)
app.get("/", (req, res) => {
	res
		.status(200)
		// Automatically defines content type to JSON
		.json({ message: "Hello from the server side!", app: "Natours" });
});

app.post("/", (req, res) => {
	res.send("You can post to this endpoint...");
});
--------------------------------------------------- */

// DOES => Read tours data from file
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/////////////////////////////////////////////////////////// GET TOURS ROUTE
// DOES => Create routing to determine how app responds to client request (url & http method)
app.get("/api/v1/tours", (req, res) => {
	// Route handler sends back all tours when user hits tours resource URL
	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours, // tours: tours
		},
	});
});

/////////////////////////////////////////////////////////// POST TOURS ROUTE

app.post("/api/v1/tours", (req, res) => {
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
});

const port = 8000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
