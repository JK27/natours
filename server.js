const mongoose = require("mongoose");
const dotenv = require("dotenv");

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
app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
