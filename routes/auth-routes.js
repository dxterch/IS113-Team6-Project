const express = require("express");
const router = express.Router(); 
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Unprotected Routes
router.get("/register", (req, res) => res.render("registration"));
router.get("/login", (req, res) => res.render("login"));

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Protected Routes (Requires Login)
router.get("/home", authMiddleware.requireLogin, authController.showGuestDashboard);

// User Profile CRUD Routes
router.get("/profile", authMiddleware.requireLogin, authController.showProfile);
router.post("/profile/update", authMiddleware.requireLogin, authController.updateProfile);
router.post("/profile/delete", authMiddleware.requireLogin, authController.deleteAccount);

// Logout Route
router.get("/logout", authMiddleware.requireLogin, authController.logoutUser);

module.exports = router;