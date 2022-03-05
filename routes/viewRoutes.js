const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

/////////////////////////////////////////////////////////// VIEW ROUTES
//////////////////////////////////////////// OVERVIEW
router.get("/", viewsController.getOverview);
//////////////////////////////////////////// TOUR
router.get("/tour", viewsController.getTour);

router.get("/tour/:slug", viewsController.getTour);

module.exports = router;