const Songs = require('../models/song-model');

exports.showSongs = async (req, res) => {
    let songs = await Songs.retrieveAll();
    res.render("manage-songs",{songs,search:null});
};

exports.searchSongs = async (req,res)=>{
    let songs = await Songs.retrieveAll();
    const search = req.body.songSearch;
    res.render("manage-songs",{songs,search});
};
