const express = require("express");
const router = express.Router();

//Temporary data
songs = {
    1:{
        name:"Hills",
        artist: "weeknd",
        avg_review: 5,
        album_cover: "/images/hills.png"
    },
    2:{
        name:"Back to me",
        artist: "Kanye West",
        avg_review: 4.1,
        album_cover: "/images/vultures.jpg"
    },
    3:{
        name:"noir",
        artist: "sho",
        avg_review: 3.7,
        album_cover: "/images/noir.jpg"
    }
}

router.get("/", (req, res) => {
    res.render("manage-songs",{songs});
});

module.exports = router;