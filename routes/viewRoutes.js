const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

/////////////////////////////////////////////////////////// VIEW ROUTES
// DOES => Cheks if there is a logged in user. Being at the top, it applies to all other routes after it.
router.use(authController.isLoggedIn);
//////////////////////////////////////////// OVERVIEW
router.get("/", viewsController.getOverview);
//////////////////////////////////////////// TOUR
router.get("/tour", viewsController.getTour);
//////////////////////////////////////////// TOUR SLUG
router.get("/tour/:slug", viewsController.getTour);
//////////////////////////////////////////// LOG IN
router.get("/login", viewsController.getLoginForm);

module.exports = router;
