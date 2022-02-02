const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

/////////////////////////////////////////////////////////// MIDDLEWARE
router.param("id", tourController.checkId);

/////////////////////////////////////////////////////////// TOUR ROUTES
router
	.route("/")
	.get(tourController.getAllTours)
	.post(tourController.checkBody, tourController.createTour);

router
	.route("/:id")
	.get(tourController.getTourById)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

module.exports = router;
