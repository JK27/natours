const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

// DOES => Middleware function protecting all routes coming after it. User must be authenticated in order to be able to access these routes.
router.use(authController.protect);

router.get(
	"/checkout-session/:tourId",
	authController.protect,
	bookingController.getCheckoutSession
);

module.exports = router;
