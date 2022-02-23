const mongoose = require("mongoose");
const slugify = require("slugify");

////////////////////////////////////////////////////////// TOUR SCHEMA
const tourSchema = new mongoose.Schema(
	{
		////////////////////////////////////////// NAME
		name: {
			type: String,
			// DOES => Sets property as required and adds error message if false.
			required: [true, "Tour must have a name"],
			unique: true,
			// DOES => Removes white space at begining and end of string.
			trim: true,
			minlength: [10, "Tour name must be at least 10 characters long"],
			maxlength: [40, "Tour name must be less than 40 characters long"],
		},
		////////////////////////////////////////// SLUG
		slug: {
			type: String,
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
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "Difficulty is either: easy, medium or difficult",
			},
		},
		////////////////////////////////////////// RATINGS AVERAGE
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be above 1.0"],
			max: [5, "Rating must be below 5.1"],
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
			validate: {
				validator: function (value) {
					// NOTE => this only points to current doc on NEW document creation.
					return value < this.price;
				},
				message: "Discount price ({VALUE}) must be lower than regular price",
			},
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
			default: Date.now(), // Mongoose automatically converts it to current date.
			select: false, // createdAt field will not show to the client.
		},
		////////////////////////////////////////// START DATES
		startDates: [Date],
		////////////////////////////////////////// SECRET TOUR
		secretTour: {
			type: Boolean,
			default: false,
		},
		////////////////////////////////////////// START LOCATION
		startLocation: {
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		////////////////////////////////////////// LOCATIONS
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					enum: ["Point"],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		////////////////////////////////////////// GUIDES
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
	},
	////////////////////////////////////////// OPTIONS
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/////////////////////////////////////////////////////////// VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

/////////////////////////////////////////////////////////// MIDDLEWARE
//////////////////////////////////////////// DOCUMENT MIDDLEWARE
// DOES => runs before .save() and .create().
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

//////////////////////////////////////////// QUERY MIDDLEWARE
// DOES => Hides secret tours from the client, finding only tour with secretTour property not equal to true.
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } });
	this.start = Date.now();
	next();
});

//////////////////////////////////////////// POST MIDDLEWARE
tourSchema.post(/^find/, function (docs, next) {
	console.log(`Query took ${Date.now() - this.start} miliseconds`);
	next();
});

//////////////////////////////////////////// POPULATE MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: "guides",
		select: "-__v -passwordChangedAt", // Fields not to be populated
	});

	next();
});
//////////////////////////////////////////// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	console.log(this.pipeline());
	next();
});

// DOES => Creates a Tour model following tourSchema.
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
