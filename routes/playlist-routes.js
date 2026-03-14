const express = require("express");
const router = express.Router();

// Display the main Playlist Management dashboard
router.get("/manage", (req, res) => {
    res.render("manage-playlist");
});

router.get("/details", (req, res) => {
    res.render("playlist-details");
});

module.exports = router;