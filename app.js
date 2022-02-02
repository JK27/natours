const express = require("express");
const { report } = require("process");
const { del } = require("express/lib/application");
const morgan = require("morgan"); // HTTP request logger middleware for node.js

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/////////////////////////////////////////////////////////// MIDDLEWARES
// DOES => Adds middleware that can modify incoming request data
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
