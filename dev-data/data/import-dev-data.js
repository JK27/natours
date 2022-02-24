const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
const Review = require("./../../models/reviewModel");
const User = require("./../../models/userModel");

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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

/////////////////////////////////////////////////////////// IMPORT DATA INTO DATABASE
const importData = async () => {
	try {
		await Tour.create(tours);
		await User.create(users, { validateBeforeSave: false });
		await Review.create(reviews);
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
		await User.deleteMany();
		await Review.deleteMany();
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
