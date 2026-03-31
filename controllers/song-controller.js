const Songs = require('../models/song-model');
const Review = require('../models/review-model'); 
const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model')

exports.showSongs = async (req, res) => {
    try {
        // Default view: No search, default sort (maybe by name)
        let songs = await Songs.find().sort({ songName: 1 }).lean();
        res.render("browse-songs", { songs, search: "", sort: "" });
    } catch (error) {
        res.render('error-page', { error });
    }
};

exports.searchSongs = async (req, res) => {
    try {
        const search = req.body.songSearch || "";
        const sortOption = req.body.sortBy;

        // 1. Build Search Filter (Case-insensitive)
        let query = {};
        if (search) {
            query.songName = { $regex: search, $options: 'i' };
        }

        
        let sortConfig = {};
        if (sortOption === 'ratingDesc') 
            {sortConfig = { avgRating: -1 }
        } else if (sortOption === 'ratingAsc') {
            sortConfig = { avgRating: 1 }
        } else if (sortOption === 'artistAZ') {
            sortConfig = { artistName: 1 }
        } else if (sortOption === 'artistZA') {
            sortConfig = { artistName: -1 }
        }
        
        let songs = await Songs.find(query).sort(sortConfig).lean();

        res.render("browse-songs", { songs, search, sort: sortOption });
    } catch (error) {
        res.render("error-page", { error });
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

        // 3. Delete all correesponding reviews
        await Review.deleteMany({ songId: songId })

        // 4. Get remaining songs 
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
        const genres = await Genre.find();
        console.log(genres)

        res.render('create-songs',{artists, genres, song:undefined})
    } catch (error) {
        console.log(error);
        res.render('error-page',{error});   
    };
};

exports.createSong = async (req, res) => {
    try {
        const { imageData, songName, artistName, genreName } = req.body;

        const newSong = new Songs({
            songName: songName,
            artistName: artistName,
            albumCover: imageData,
            genreName: genreName
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
        const genres = await Genre.find();

        res.render('create-songs',{artists, song, genres})
    } catch (error) {
        console.log("Error in updating song:", error);
        res.status(500).json({ success: false, error: error.message });
    };
};

exports.updateSongs = async (req,res) => {
    try {
        const { songId, songName, artistName, genreName, imageData } = req.body;

        let updateFields = { songName, artistName, genreName };

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
