const mongoose = require("mongoose");

/////////////////////////////////////////////////////////// BOOKING SCHEMA
const bookingSchema = new mongoose.Schema({
	////////////////////////////////////////// TOUR
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: "Tour",
		required: [true, "Booking must belong to a tour."],
	},
	////////////////////////////////////////// USER
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "Booking must belong to a user."],
	},
	////////////////////////////////////////// PRICE
	price: {
		type: Number,
		required: [true, "Booking must have a price."],
	},
	////////////////////////////////////////// CREATED AT
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	////////////////////////////////////////// PAID
	paid: {
		type: Boolean,
		default: true,
	},
});

/////////////////////////////////////////////////////////// MIDDLEWARE
//////////////////////////////////////////// QUERY MIDDLEWARE
bookingSchema.pre(/^find/, function (next) {
	this.populate("user").populate({
		path: "tour",
		select: "name",
	});
});

// DOES => Creates a booking model following bookingSchema.

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
