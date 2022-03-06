const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

/////////////////////////////////////////////////////////// VIEW ROUTES
//////////////////////////////////////////// OVERVIEW
router.get("/", viewsController.getOverview);
//////////////////////////////////////////// TOUR
router.get("/tour", viewsController.getTour);
//////////////////////////////////////////// TOUR SLUG
router.get("/tour/:slug", authController.protect, viewsController.getTour);
//////////////////////////////////////////// LOG IN
router.get("/login", viewsController.getLoginForm);

module.exports = router;
