const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artist-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Artist Management Pages
router.get("/manage", authMiddleware.requireAdmin, artistController.showArtistPage);
router.post("/manage", authMiddleware.requireAdmin, artistController.searchManageArtists);

// Browse Artist Pages
router.get("/browse", authMiddleware.requireLogin, artistController.browseArtists);
router.post("/browse", authMiddleware.requireLogin, artistController.searchArtists);

// Artist Details Pages
router.get("/details", authMiddleware.requireLogin, artistController.showArtistDetails);

// Artist Creation Pages
router.get("/create", authMiddleware.requireAdmin, artistController.showCreateArtistPage);
router.post("/create", authMiddleware.requireAdmin, artistController.processAddArtist);

// Artist Update Pages
router.get("/update", authMiddleware.requireAdmin, artistController.showUpdateArtistPage);
router.post("/update", authMiddleware.requireAdmin, artistController.processUpdateArtist);

// Artist Deletion Pages
router.post("/delete", authMiddleware.requireAdmin, artistController.processDeleteArtist);

// Artist Follow
router.post('/follow/:id', authMiddleware.requireLogin, artistController.toggleFollowArtist);

module.exports = router;