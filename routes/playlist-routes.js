const express = require("express");
const router = express.Router();
const Playlist = require("../models/playlist-model");
const Song = require("../models/song-model");

// Display the main Playlist Management dashboard
router.get("/manage", async (req, res) => {
    let playlist = null;
    let pname = "";
    if (req.params.id){
        playlist = await playlist.findById(req.params.id);
        if (playlist){
            pname=playlist.playlistName;
        }
    }
    const songs = await Song.find();
    res.render("manage-playlist", 
        {playlist: null, pname, playlistName: pname, songs});
});

router.get("/details", (req, res) => {
    res.render("playlist-details");
});

module.exports = router;