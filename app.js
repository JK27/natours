const express = require("express");

const app = express();

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

const port = 8000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
