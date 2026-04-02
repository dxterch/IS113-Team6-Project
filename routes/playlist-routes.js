const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Protect all playlist routes
router.use(authMiddleware.requireLogin);

// Manage List
router.get("/manage-list", playlistController.showAllPlaylist);

// Create
router.get("/new-playlist", playlistController.showCreatePlaylistForm);

// Update
router.post("/edit-form", playlistController.showEditPlaylistForm);
router.post("/edit", playlistController.savePlaylist);

// Delete
router.post("/delete", playlistController.deletePlaylist);

//show playlist 
router.get("/view", playlistController.getPlaylistById)

//edit 
router.get("/edit-playlist", playlistController.showEditPlaylistForm)
module.exports = router;

