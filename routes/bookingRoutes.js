const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

// DOES => Middleware function protecting all routes coming after it. User must be authenticated in order to be able to access these routes.
router.use(authController.protect);
//////////////////////////////////////////// CHECKOUT SESSION ROUTE
router.get("/checkout-session/:tourId", bookingController.getCheckoutSession);
//////////////////////////////////////////// ROOT ROUTES
router.use(authController.restrictTo("admin", "lead-guide"));
router
	.route("/")
	.get(bookingController.getAllBookings)
	.post(bookingController.createBooking);

//////////////////////////////////////////// ID ROUTES
router
	.route("/:id")
	.get(bookingController.getBooking)
	.patch(bookingController.updateBooking)
	.delete(bookingController.deleteBooking);

module.exports = router;
