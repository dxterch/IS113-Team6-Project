const Songs = require('../models/song-model');

exports.showSongs = async (req, res) => {
    try{
        let songs = await Songs.retrieveAll();
        res.render("browse-songs",{songs,search:null});
    } catch (error) {
        console.log(error)
        res.render('error-page',{error})
    } 
};

exports.searchSongs = async (req,res)=>{
    try{
        let songs = await Songs.retrieveAll();
        const search = req.body.songSearch;
        res.render("browse-songs",{songs,search});
    } catch (error) {
        console.log(error)
        res.render("error-page", {error})
    }
};

exports.updateSongs = async (req,res) =>{
    
};
