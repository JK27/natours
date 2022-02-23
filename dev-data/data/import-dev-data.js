const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

/////////////////////////////////////////////////////////// DOTENV
dotenv.config({ path: "./config.env" });

/////////////////////////////////////////////////////////// MONGOOSE
const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("DB connection succesful ✅"));

/////////////////////////////////////////////////////////// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

/////////////////////////////////////////////////////////// IMPORT DATA INTO DATABASE
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log("Data succesfully loaded 😎");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

///////////////////////////////////////////////////////////- DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log("Data succesfully deleted 🙈");
	} catch (err) {
		console.log(err);
	}
	process.exit();
};

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}
