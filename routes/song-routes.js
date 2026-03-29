const express = require("express");
const router = express.Router();
const songController = require("../controllers/song-controller")
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/",authMiddleware.requireLogin ,songController.showSongs);
router.post("/",authMiddleware.requireLogin, songController.searchSongs);

module.exports = router;