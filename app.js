const express = require("express");
const morgan = require("morgan"); // HTTP request logger middleware for node.js
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/////////////////////////////////////////////////////////// GLOBAL MIDDLEWARES
// DOES => Sets security HTTP headers.
app.use(helmet());

// DOES => Only use morgan when on development.
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// DOES => Limits number of requests from the client to prevent denial of service and brute force attacks.
const limiter = ratelimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP. Please try again in one hour.",
});
app.use("/api", limiter);

// DOES => Adds middleware that can modify incoming request data, enabling reading data from the body of the request.
app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/public`));

// DOES => Data sanitization against NoSql query injection. Looks at request body, query string and params and filters out all '$' and '.' characters used in mongoDB operators.
app.use(mongoSanitize());

// DOES => Data sanitization against XSS attacks.
app.use(xss());

// DOES => Prevents parameter pollution. Cleras up query string using only the last parameter, with the exception of fields in the whitelist.
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	})
);

// DOES => Serves static files.
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/////////////////////////////////////////////////////////// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// DOES => Handles errors for all incorrect urls, urls that don't exist, sending a 404.
// NOTE => This route needs to be last to run to allow valid urls to be found.
app.all("*", (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

//////////////////////////////////////////// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
