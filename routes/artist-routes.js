const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// READ: Show Artist Page and Browse Artist Page
router.get("/manage", authMiddleware.requireAdmin, artistController.showArtistPage);
router.get("/browse", authMiddleware.requireLogin, artistController.browseArtists);

// READ: Show Artist Details Page
router.get("/details", authMiddleware.requireLogin, artistController.showArtistDetails);

// CREATE: Show Create Artist Page
router.get("/create", authMiddleware.requireAdmin, artistController.showCreateArtistPage);
router.post("/create", authMiddleware.requireAdmin, artistController.processAddArtist);

// UPDATE: Show Update Artist Page
router.get("/update", authMiddleware.requireAdmin, artistController.showUpdateArtistPage);
router.post("/update", authMiddleware.requireAdmin, artistController.processUpdateArtist);

// DELETE: Process Deletion of Artist
router.post("/delete", authMiddleware.requireAdmin, artistController.processDeleteArtist);

module.exports = router;