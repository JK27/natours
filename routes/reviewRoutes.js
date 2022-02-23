const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// DOES => Middleware function protecting all routes coming after it. User must be authenticated in order to be able to access these routes.
router.use(authController.protect);

//////////////////////////////////////////// ROOT ROUTES
router
	.route("/")
	.get(reviewController.getAllReviews)
	.post(
		authController.restrictTo("user"),
		reviewController.setTourUserIds,
		reviewController.createReview
	);

//////////////////////////////////////////// ID ROUTES
router
	.route("/:id")
	.get(reviewController.getReviewById)
	.patch(
		authController.restrictTo("user", "admin"),
		reviewController.updateReview
	)
	.delete(
		authController.restrictTo("user", "admin"),
		reviewController.deleteReview
	);

module.exports = router;
