const express = require("express");
const router = express.Router();

// Display the main Playlist Management dashboard
router.get("/manage", async (req, res) => {
    let playlist = null;
if (req.params.id){
    playlist = await playlist.findById(req.params.id).populate('songs');
}
    res.render("manage-playlist", {playlist: null});
});

router.get("/details", (req, res) => {
    res.render("playlist-details");
});

module.exports = router;