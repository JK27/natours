const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

/////////////////////////////////////////////////////////// TOUR ROUTES
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

//////////////////////////////////////////// TOUR REVIEWS
// DOES => Use reviewRouter for this type of URL
router.use("/:tourId/reviews", reviewRouter);

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
