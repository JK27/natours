const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

/////////////////////////////////////////////////////////// USER ROUTES
//////////////////////////////////////////// AUHENTICATION ROUTES
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

//////////////////////////////////////////// PASSWORD ROUTES
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// DOES => Middleware function protecting all routes coming after it. User must be authenticated in order to be able to access these routes.
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

//////////////////////////////////////////// CURRENT USER ROUTES
router.get(
	"/me",

	userController.getMe,
	userController.getUserById
);
router.patch(
	"/updateMe",
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

// DOES => Restricts access to all routes below only for admin users.
router.use(authController.restrictTo("admin"));
//////////////////////////////////////////// ROOT ROUTES
router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

//////////////////////////////////////////// ID ROUTES
router
	.route("/:id")
	.get(userController.getUserById)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
