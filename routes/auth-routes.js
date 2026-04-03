const express = require("express");
const router = express.Router(); 
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const playlistController = require("../controllers/playlist-controller");

// Unprotected Routes
router.get("/register", (req, res) => res.render("auth/registration"));
router.get("/login", (req, res) => res.render("auth/login"));

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Protected Routes (Requires Login)
router.get("/home", authMiddleware.requireLogin, authController.showDashboard);

// User Profile CRUD Routes
router.get("/profile", authMiddleware.requireLogin, authController.showProfile);
router.post("/profile/update", authMiddleware.requireLogin, authController.updateProfile);
router.post("/profile/update-password", authMiddleware.requireLogin, authController.updatePassword);
router.post("/profile/delete", authMiddleware.requireLogin, authController.deleteAccount);

// Logout Route
router.get("/logout", authMiddleware.requireLogin, authController.logoutUser);
router.get("/edit-playlist", playlistController.showEditPlaylistForm)
//router.post("/edit-form", playlistController.showEditPlaylistForm);
router.post("/edit", playlistController.savePlaylist);
module.exports = router;