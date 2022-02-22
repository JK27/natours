const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");

const router = express.Router();

/////////////////////////////////////////////////////////// MIDDLEWARE
// router.param("id", tourController.checkId);

/////////////////////////////////////////////////////////// TOUR ROUTES
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
	.delete(tourController.deleteTour);

module.exports = router;
