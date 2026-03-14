const express = require("express");
const router = express.Router();

//Temporary data
const songs = {
    1: {
        name: "Hills",
        artist: "The Weeknd",
        avg_review: 5,
        album_cover: "/images/hills.png"
    },
    2: {
        name: "Back to me",
        artist: "Kanye West",
        avg_review: 4.1,
        album_cover: "/images/vultures.jpg"
    },
    3: {
        name: "Noir",
        artist: "Sho",
        avg_review: 3.7,
        album_cover: "/images/noir.jpg"
    },
    4: {
        name: "Blinding Lights",
        artist: "The Weeknd",
        avg_review: 4.8,
        album_cover: "/images/blinding_lights.png"
    },
    5: {
        name: "Runaway",
        artist: "Kanye West",
        avg_review: 4.9,
        album_cover: "/images/runaway.jpg"
    },
    6: {
        name: "Levitating",
        artist: "Dua Lipa",
        avg_review: 4.2,
        album_cover: "/images/levitating.jpg"
    },
    7: {
        name: "Circles",
        artist: "Post Malone",
        avg_review: 4.5,
        album_cover: "/images/circles.jpg"
    },
    8: {
        name: "Bad Guy",
        artist: "Billie Eilish",
        avg_review: 4.3,
        album_cover: "/images/bad_guy.jpg"
    },
    9: {
        name: "Starboy",
        artist: "The Weeknd",
        avg_review: 4.7,
        album_cover: "/images/starboy.jpg"
    },
    10: {
        name: "God's Plan",
        artist: "Drake",
        avg_review: 4.0,
        album_cover: "/images/gods_plan.jpg"
    },
};

router.get("/", (req, res) => {
    res.render("manage-songs",{songs,search:null});
});

router.post("/", (req,res)=>{
    const search = req.body.songSearch;
    res.render("manage-songs",{songs,search});
});
module.exports = router;