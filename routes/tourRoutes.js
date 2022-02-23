const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

/////////////////////////////////////////////////////////// TOUR ROUTES
// DOES => Use reviewRouter for this type of URL
router.use("/:tourId/reviews", reviewRouter);

router
	.route("/top-5-tours")
	.get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
	.route("/")
	.get(authController.protect, tourController.getAllTours)
	.post(tourController.createTour);

router
	.route("/:id")
	.get(tourController.getTourById)
	.patch(tourController.updateTour)
	.delete(
		authController.protect,
		authController.restrictTo("admin", "lead-guide"),
		tourController.deleteTour
	);

module.exports = router;
