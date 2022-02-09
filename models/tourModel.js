const mongoose = require("mongoose");

////////////////////////////////////////////////////////// TOUR SCHEMA
const tourSchema = new mongoose.Schema({
	////////////////////////////////////////// NAME
	name: {
		type: String,
		// DOES => Sets property as required and adds error message if false
		required: [true, "Tour must have a name"],
		unique: true,
		// DOES => Removes white space at begining and end of string
		trim: true,
	},
	////////////////////////////////////////// DURATION
	duration: {
		type: Number,
		required: [true, "Tour must have a duration"],
	},
	////////////////////////////////////////// MAX GROUP SIZE
	maxGroupSize: {
		type: Number,
		required: [true, "Tour must have a group size"],
	},
	////////////////////////////////////////// DIFFICULTY
	difficulty: {
		type: String,
		required: [true, "Tour must have a difficulty"],
	},
	////////////////////////////////////////// RATINGS AVERAGE
	ratingsAverage: {
		type: Number,
		default: 4.5,
	},
	////////////////////////////////////////// RATINGS QUANTITY
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	////////////////////////////////////////// PRICE
	price: {
		type: Number,
		required: [true, "Tour must have a price"],
	},
	////////////////////////////////////////// PRICE DISCOUNT
	priceDiscount: {
		type: Number,
	},
	////////////////////////////////////////// SUMMARY
	summary: {
		type: String,
		required: [true, "Tour must have a description"],
		trim: true,
	},
	////////////////////////////////////////// DESCRIPTION
	description: {
		type: String,
		trim: true,
	},
	////////////////////////////////////////// COVER IMAGE
	imageCover: {
		type: String,
		required: [true, "Tour must have a cover image"],
	},
	////////////////////////////////////////// IMAGES
	images: [String],
	////////////////////////////////////////// CREATED AT
	createdAt: {
		type: Date,
		default: Date.now(), // Mongoose automatically converts it to current date
		select: false, // createdAt field will not show to the client
	},
	////////////////////////////////////////// START DATES
	startDates: [Date],
});

// DOES => Creates a Tour model following tourSchema
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
