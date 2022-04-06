const path = require("path");
const express = require("express");
const morgan = require("morgan"); // HTTP request logger middleware for node.js
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

/////////////////////////////////////////////////////////// TEMPLATE ENGINE
// DOES => Sets 'pug' as the template engine.
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/////////////////////////////////////////////////////////// GLOBAL MIDDLEWARES
//////////////////////////////////////////// EXPRESS STATIC
// DOES => Serves static files.
app.use(express.static(path.join(__dirname, "public")));

//////////////////////////////////////////// HELMET
// DOES => Sets security HTTP headers.
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
				baseUri: ["'self'"],
				fontSrc: ["'self'", "https:", "data:"],
				scriptSrc: [
					"'self'",
					"https:",
					"http:",
					"blob:",
					"https://*.mapbox.com",
					"https://js.stripe.com",
					"https://m.stripe.network",
					"https://*.cloudflare.com",
				],
				frameSrc: ["'self'", "https://js.stripe.com"],
				objectSrc: ["'none'"],
				styleSrc: ["'self'", "https:", "'unsafe-inline'"],
				workerSrc: [
					"'self'",
					"data:",
					"blob:",
					"https://*.tiles.mapbox.com",
					"https://api.mapbox.com",
					"https://events.mapbox.com",
					"https://m.stripe.network",
				],
				childSrc: ["'self'", "blob:"],
				imgSrc: ["'self'", "data:", "blob:"],
				formAction: ["'self'"],
				connectSrc: [
					"'self'",
					"data:",
					"blob:",
					"https://*.stripe.com",
					"https://*.mapbox.com",
					"https://*.cloudflare.com/",
					"https://bundle.js:*",
					"ws://127.0.0.1:*/",
				],
			},
		},
	})
);
//////////////////////////////////////////// MORGAN
// DOES => Only use morgan for logging when on development.
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

//////////////////////////////////////////// LIMITER
// DOES => Limits number of requests from the client to prevent denial of service and brute force attacks.
const limiter = ratelimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP. Please try again in one hour.",
});
app.use("/api", limiter);

//////////////////////////////////////////// BODY PARSER
// DOES => Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//////////////////////////////////////////// DATA SANITIZATION
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

//////////////////////////////////////////// TEST MIDDLEWARE
// DOES => Adds middleware that can modify incoming request data, enabling reading data from the body of the request.
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

/////////////////////////////////////////////////////////// ROUTES
//////////////////////////////////////////// API ROUTES
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

// DOES => Handles errors for all incorrect urls, urls that don't exist, sending a 404.
// NOTE => This route needs to be last to run to allow valid urls to be found.
app.all("*", (req, res, next) => {
	next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

//////////////////////////////////////////// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
