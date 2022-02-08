const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

/////////////////////////////////////////////////////////// DOTENV
dotenv.config({ path: "./config.env" });

/////////////////////////////////////////////////////////// MONGOOSE
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("DB connection succesful"));

const tourSchema = new mongoose.Schema({
	tour_name: {
		type: String,
		// DOES => Sets property as required and adds error message if false
		required: [true, "A tour must have a name"],
		unique: true,
	},
	rating: {
		type: Number,
		default: 4.5,
	},
	price: {
		type: Number,
		// DOES => Sets property as required and adds error message if false
		required: [true, "A tour must have a price"],
	},
});

// DOES => Creates a Tour model following tourSchema
const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
	tour_name: "The Sea SAilor",
	rating: 4.7,
	price: 666,
});

testTour
	.save()
	.then(doc => {
		console.log(doc);
	})
	.catch(err => {
		console.log("ERROR 💥", err);
	});

/////////////////////////////////////////////////////////// START SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
