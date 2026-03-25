const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist-controller");

router.get("/manage-list", playlistController.showAllPlaylists);
router.get("/new-playlist", playlistController.showCreatedPlaylist);
router.post("/edit-form", playlistController.showEditPlaylistForm);
router.post("/edit", playlistController.savePlaylist);
router.post("/delete", playlistController.deletePlaylist);
module.exports = router;

// Display the main Playlist Management dashboard
router.get("/manage", async (req, res) => {
    // check if user is logged in 
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    try {
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
    } catch(error) {
        console.error(error);
        res.send("Error loading playlist manager");
    }
    
});

router.post("/save", async (req, res) => {
    if (!req.session.userId) return res.redirect('/auth/login');
    
    try {
        // TODO: The student handling Playlists needs to implement the logic here 
        // to either Create a new playlist or Update an existing one.
        // Example:
        // await Playlist.create({ uid: req.session.userId, pname: req.body.pname, ... });
        res.redirect("/auth/home");
    } catch (error) {
        console.error(error);
        res.send("Error saving playlist");
    }
});

router.get("/details", (req, res) => {
    res.render("playlist-details");
});

module.exports = router;
