const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

/////////////////////////////////////////////////////////// TOUR ROUTES
// DOES => When finding this URL, use the reviewRouter instead.
router.use("/:tourId/reviews", reviewRouter);

//////////////////////////////////////////// TOURS WITHIN
// DOES => i.e. /tours-within/250/center/42.92635035090456, -71.48275451623525/unit/mi
router
	.route("/tours-within/:distance/center/:latlng/unit/:unit")
	.get(tourController.getAllToursWithin);

//////////////////////////////////////////// ROOT
router
	.route("/")
	.get(tourController.getAllTours)
	.post(
		authController.protect,
		authController.restrictTo("admin", "lead-guide"),
		tourController.createTour
	);

//////////////////////////////////////////// TOUR ID
router
	.route("/:id")
	.get(tourController.getTourById)
	.patch(
		authController.protect,
		authController.restrictTo("admin", "lead-guide"),
		tourController.updateTour
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin", "lead-guide"),
		tourController.deleteTour
	);

//////////////////////////////////////////// TOP 5 TOURS
router
	.route("/top-5-tours")
	.get(tourController.aliasTopTours, tourController.getAllTours);

//////////////////////////////////////////// TOUR STATS
router.route("/tour-stats").get(tourController.getTourStats);

//////////////////////////////////////////// MONTHLY PLAN
router
	.route("/monthly-plan/:year")
	.get(
		authController.protect,
		authController.restrictTo("admin", "lead-guide", "guide"),
		tourController.getMonthlyPlan
	);

module.exports = router;
