const AppError = require("./../utils/appError");

/////////////////////////////////////////////////////////// HANDLE CAST ERROR DB
const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, 400);
};

/////////////////////////////////////////////////////////// HANDLE CAST ERROR DB
const handelDuplicateFieldsDB = err => {
	const value = err.keyValue.name;
	const message = `Duplicate field value: ${value}. Please use another value.`;
	return new AppError(message, 400);
};

/////////////////////////////////////////////////////////// HANDLE VALIDATION ERROR DB
const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};
/////////////////////////////////////////////////////////// HANDLE JWT ERRORS
const handleJWTError = () =>
	new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
	new AppError("Your token has expired. Please log in again.", 401);

/////////////////////////////////////////////////////////// SEND ERROR IN DEVELOPMENT
const sendErrorDev = (err, req, res) => {
	////////////////////////////////////////// API
	if (req.originalUrl.startsWith("/api")) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}
	////////////////////////////////////////// RENDERED WEBSITE
	console.error("ERROR 💥", err);
	return res.status(err.statusCode).render("error", {
		title: "Something went wrong!",
		msg: err.message,
	});
};

/////////////////////////////////////////////////////////// SEND ERROR PRODUCTION
const sendErrorProd = (err, req, res) => {
	////////////////////////////////////////// API
	if (req.originalUrl.startsWith("/api")) {
		///////////////////////// OPERATIONAL ERROR
		// DOES => If the error is operational or a trusted error, then send message to the client. Otherwise, if programming or unknown error, then don't leak error details to client.
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		///////////////////////// UNKNOWN ERROR
		console.error("ERROR 💥", err);
		return res.status(500).json({
			status: "error",
			message: "Something went very wrong!",
		});
	}
	////////////////////////////////////////// RENDERED WEBSITE
	///////////////////////// OPERATIONAL ERROR
	if (err.isOperational) {
		console.log(err);
		return res.status(err.statusCode).render("error", {
			title: "Something went wrong!",
			msg: err.message,
		});
	}
	///////////////////////// UNKNOWN ERROR
	console.error("ERROR 💥", err);
	return res.status(err.statusCode).render("error", {
		title: "Something went wrong!",
		msg: "Please try again later.",
	});
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err, name: err.name };
		error.message = err.message;

		if (err.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handelDuplicateFieldsDB(error);
		if (err.name === "ValidationError") error = handleValidationErrorDB(error);
		if (err.name === "JsonWebTokenError") error = handleJWTError();
		if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

		sendErrorProd(error, req, res);
	}
};
