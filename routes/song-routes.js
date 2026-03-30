const express = require("express");
const router = express.Router();
const songController = require("../controllers/song-controller")
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/browse",authMiddleware.requireLogin ,songController.showSongs);
router.post("/browse",authMiddleware.requireLogin, songController.searchSongs);

router.get('/manage-songs', authMiddleware.requireAdmin, songController.manageSongs);

router.post('/delete', authMiddleware.requireAdmin, songController.deleteSongs);

router.post('/update', authMiddleware.requireAdmin, songController.updateSongsPage);
router.post('/changed', authMiddleware.requireAdmin, songController.updateSongs)

router.get('/create', authMiddleware.requireAdmin, songController.createSongTemp);
router.post('/upload', authMiddleware.requireAdmin, songController.createSong);



module.exports = router;