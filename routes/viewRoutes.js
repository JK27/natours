const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

/////////////////////////////////////////////////////////// VIEW ROUTES
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

module.exports = router;
