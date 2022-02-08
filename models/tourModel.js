const mongoose = require("mongoose");

////////////////////////////////////////////////////////// TOUR SCHEMA
const tourSchema = new mongoose.Schema({
	name: {
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

module.exports = Tour;
