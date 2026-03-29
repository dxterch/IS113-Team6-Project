const Songs = require('../models/song-model');
const Review = require('../models/review-model'); 

exports.showSongs = async (req, res) => {
    try{
        let songs = await Songs.retrieveAll();
        let reviews = await Review.find();
        res.render("browse-songs",{songs,search:null,reviews});
    } catch (error) {
        console.log(error)
        res.render('error-page',{error})
    } 
};

exports.searchSongs = async (req,res)=>{
    try{
        let songs = await Songs.retrieveAll();
        let reviews = await Review.find();
        const search = req.body.songSearch;
        res.render("browse-songs",{songs,search,reviews});
    } catch (error) {
        console.log(error)
        res.render("error-page", {error})
    }
};

exports.manageSongs = async (req,res)=>{
    try{
        let songs = await Songs.retrieveAll();
        let reviews = await Review.find();
        res.render("create-manage-songs",{songs});
    } catch (error) {
        console.log(error)
        res.render('error-page',{error})
    } 
};

exports.updateSongs = async (req,res) =>{
    
};
