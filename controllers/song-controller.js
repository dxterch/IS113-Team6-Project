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
        res.render('create-songs',{artists, song:undefined})
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
        console.log("Error in creating song:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateSongsPage = async (req,res) =>{
    try {
        const songId = req.body.song;
        const song = await Songs.findById(songId)
        
        const artists = await Artist.retrieveAll();

        res.render('create-songs',{artists, song})
    } catch (error) {
        console.log("Error in updating song:", error);
        res.status(500).json({ success: false, error: error.message });
    };
};

exports.updateSongs = async (req,res) => {
    try {
        const { songId, songName, artistName, imageData } = req.body;

        let updateFields = { songName, artistName };

        // ONLY add the image to the update if it's NOT null
        if (imageData !== null) {
            updateFields.albumCover = imageData;
        }

        await Songs.findByIdAndUpdate(songId, updateFields);
        res.json({ message: "Update successful!" });

    } catch (error) {
        console.log("Error in updating song:", error);
        res.status(500).json({ success: false, error: error.message });
    };
};
