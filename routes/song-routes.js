const express = require("express");
const router = express.Router();
const songController = require("../controllers/song-controller")


router.get("/", songController.showSongs);
router.post("/", songController.searchSongs);

module.exports = router;