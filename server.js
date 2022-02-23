const mongoose = require("mongoose");
const dotenv = require("dotenv");

/////////////////////////////////////////////////////////// UNCAUGHT EXCEPTIONS
process.on("uncaughtException", err => {
	console.log("UNCAUGHT EXCEPTION! 💥 SHUTTING DOWN...");
	console.log(err.name, err.message);
	// DOES => Gives the server time to finish all pending requests before exiting the application.
	process.exit(1);
});

/////////////////////////////////////////////////////////// DOTENV
dotenv.config({ path: "./config.env" });
const app = require("./app");

/////////////////////////////////////////////////////////// MONGOOSE
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("DB connection succesful ✅"));

/////////////////////////////////////////////////////////// START SERVER
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

/////////////////////////////////////////////////////////// UNHANDLE REJECTIONS
process.on("unhandledRejection", err => {
	console.log("UNHANDLED REJECTION! 💥 SHUTTING DOWN...");
	console.log(err.name, err.message);
	// DOES => Gives the server time to finish all pending requests before exiting the application.
	server.close(() => {
		process.exit(1);
	});
});
