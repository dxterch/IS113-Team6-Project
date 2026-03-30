const express = require("express");
const router = express.Router();
const songController = require("../controllers/song-controller")
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/browse",authMiddleware.requireLogin ,songController.showSongs);
router.post("/browse",authMiddleware.requireLogin, songController.searchSongs);

router.get('/manage-songs', authMiddleware.requireAdmin, songController.manageSongs);
router.post('/delete', authMiddleware.requireAdmin, songController.deleteSongs);

router.get('/create', songController.createSongTemp)
router.post('/upload', songController.createSong)

module.exports = router;