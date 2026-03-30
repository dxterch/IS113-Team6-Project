const Songs = require('../models/song-model');
const Review = require('../models/review-model'); 
const Artist = require('../models/artist-model');

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
        res.render("manage-songs",{songs, msg:undefined});
    } catch (error) {
        console.log(error)
        res.render('error-page',{error})
    } 
};

exports.deleteSongs = async (req, res) => {
    try {
        const songId = req.body.songId;

        // 1. Find the song first using native findById
        const songToDelete = await Songs.findSong(songId);

        if (!songToDelete) {
            return res.render('error-page', { error: "Song not found" });
        }

        const deletedName = songToDelete.songName;

        // 2. Delete using native findByIdAndDelete
        await Songs.findByIdAndDelete(songId);

        // 3. Get remaining songs using native find()
        const songs = await Songs.retrieveAll();
        
        let msg = `Successfully deleted ${deletedName}`;
        res.render('manage-songs', { songs, msg });

    } catch (error) {
        console.log("Delete Error:", error);
        res.render('error-page', { error });
    }
};

exports.createSongTemp = async (req,res) => {
    try {
        const artists = await Artist.retrieveAll();
        res.render('create-songs',{artists})
    } catch (error) {
        console.log(error);
        res.render('error-page',{error});   
    };
};

exports.createSong = async (req, res) => {
    try {
        const { imageData, songName, artistName } = req.body;

        const newSong = new Songs({
            songName: songName,
            artistName: artistName,
            albumCover: imageData 
        });

        await newSong.save();

        // Send a JSON success message instead of rendering a page
        res.status(200).json({ success: true, message: "New Song Created" });

    } catch (error) {
        console.log("Error in createSong:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateSongs = async (req,res) =>{
    
};
