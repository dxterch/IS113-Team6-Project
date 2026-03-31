const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genre-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Logged-in users can browse genres
router.get("/browse", authMiddleware.requireLogin, genreController.browseGenres);
router.get("/details", authMiddleware.requireLogin, genreController.showGenreDetails);

// Only admins can manage genres
router.get("/manage", authMiddleware.requireAdmin, genreController.manageGenres);
router.get("/create", authMiddleware.requireAdmin, genreController.showCreateGenreForm);
router.post("/create", authMiddleware.requireAdmin, genreController.createGenre);
router.post("/edit-form", authMiddleware.requireAdmin, genreController.showUpdateGenreForm);
router.post("/update", authMiddleware.requireAdmin, genreController.updateGenre);
router.post("/delete", authMiddleware.requireAdmin, genreController.deleteGenre);

module.exports = router;