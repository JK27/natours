/////////////////////////////////////////////////////////// SEND ERROR DEVELOPMENT
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

/////////////////////////////////////////////////////////// SEND ERROR PRODUCTION
const sendErrorProd = (err, res) => {
	// DOES => If the error is operational or a trusted error, then send message to the client. Otherwise, if programming or unknown error, then don't leak error details to client.
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error("ERROR 💥", err);

		res.status(500).json({
			status: "Error",
			message: "Something went wrong 🤦‍♂️",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "development") {
		sendErrorProd(err, res);
	}
};
