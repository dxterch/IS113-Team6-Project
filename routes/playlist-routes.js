const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist-controller");

router.get("/manage-list", playlistController.showAllPlaylists);
router.get("/new-playlist", playlistController.showCreatedPlaylist);
router.post("/edit-form", playlistController.showEditPlaylistForm);
router.post("/edit", playlistController.savePlaylist);
router.post("/delete", playlistController.deletePlaylist);
module.exports = router;
