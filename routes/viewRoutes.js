const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

/////////////////////////////////////////////////////////// VIEW ROUTES
//////////////////////////////////////////// ALERTS
router.use(viewsController.alerts);
//////////////////////////////////////////// OVERVIEW
router.get("/", authController.isLoggedIn, viewsController.getOverview);
//////////////////////////////////////////// TOUR
router.get("/tour", authController.isLoggedIn, viewsController.getTour);
//////////////////////////////////////////// TOUR SLUG
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
//////////////////////////////////////////// LOG IN
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
//////////////////////////////////////////// GET ACCOUNT
router.get("/me", authController.protect, viewsController.getAccount);
//////////////////////////////////////////// GET MY TOURS
router.get("/my-tours", authController.protect, viewsController.getMyTours);
//////////////////////////////////////////// UPDATE USER DATA
router.post(
	"/submit-user-data",
	authController.protect,
	viewsController.updateUserData
);

module.exports = router;
