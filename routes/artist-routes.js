const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// ==========================================
// User Routes (Require Login)
// ==========================================

// Browse Artists: View and Searchs Artists
router.get("/browse", authMiddleware.requireLogin, artistController.browseArtists);
router.post("/browse", authMiddleware.requireLogin, artistController.searchArtists);

// Artist Details: View specific artist's profile and songs
router.get("/details", authMiddleware.requireLogin, artistController.showArtistDetails);

// Following System: View personal follow list
router.get("/following", authMiddleware.requireLogin, artistController.viewFollowedArtists);
router.post('/follow/:id', authMiddleware.requireLogin, artistController.toggleFollowArtist);


// ==========================================
// Admin Routes (Require Admin Rights)
// ==========================================

// Artist Management: View and Search Artists, with options to Manage Artists
router.get("/manage", authMiddleware.requireAdmin, artistController.showArtistPage);
router.post("/manage", authMiddleware.requireAdmin, artistController.searchManageArtists);

// Create Artist: Add new artist
router.get("/create", authMiddleware.requireAdmin, artistController.showCreateArtistPage);
router.post("/create", authMiddleware.requireAdmin, artistController.processAddArtist);

// Update Artist: Update existing artist
router.get("/update", authMiddleware.requireAdmin, artistController.showUpdateArtistPage);
router.post("/update", authMiddleware.requireAdmin, artistController.processUpdateArtist);

// Delete Artist: Delete existing artist
router.post("/delete", authMiddleware.requireAdmin, artistController.processDeleteArtist);

module.exports = router;