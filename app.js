const express = require("express");
const morgan = require("morgan"); // HTTP request logger middleware for node.js
const ratelimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/////////////////////////////////////////////////////////// GLOBAL MIDDLEWARES
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

// DOES => Adds middleware that can modify incoming request data.
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/////////////////////////////////////////////////////////// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// DOES => Handles errors for all incorrect urls, urls that don't exist, sending a 404
// NOTE => This route needs to be last to run to allow valid urls to be found
app.all("*", (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

//////////////////////////////////////////// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
