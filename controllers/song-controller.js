const Songs = require('../models/song-model');
const Review = require('../models/review-model'); 
const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model');

// --- DISPLAY LOGIC ---

exports.showSongs = async (req, res) => {
    try {
        const songs = await Songs.retrieveAll()
            .sort({ songName: 1 })
            .populate('artistId')
            .lean();
            
        res.render("songs/browse-songs", { songs, search: "", sort: "" });
    } catch (error) {
        console.error("showSongs Error:", error);
        res.status(500).render('main/error-page', { error: "Failed to load songs." });
    }
};

exports.searchSongs = async (req, res) => {
    try {
        const search = req.body.songSearch || "";
        const sortOption = req.body.sortBy;

        let query = {};
        if (search) {
            // Regex search for song names (case-insensitive)
            query.songName = { $regex: search, $options: 'i' };
        }

        let songs = await Songs.retrieveAll(query).populate('artistId').lean();

        // Manual sorting for populated fields (Artist Name)
        if (sortOption === 'artistAZ') {
            songs.sort((a, b) => (a.artistId?.artistName || "").localeCompare(b.artistId?.artistName || ""));
        } else if (sortOption === 'artistZA') {
            songs.sort((a, b) => (b.artistId?.artistName || "").localeCompare(a.artistId?.artistName || ""));
        } else if (sortOption === 'songAZ') {
            songs.sort((a, b) => a.songName.localeCompare(b.songName));
        }

        res.render("songs/browse-songs", { songs, search, sort: sortOption });
    } catch (error) {
        console.error("searchSongs Error:", error);
        res.status(500).render("main/error-page", { error: "Search failed." });
    }
};

// --- MANAGEMENT LOGIC ---

exports.manageSongs = async (req, res) => {
    try {
        const songs = await Songs.retrieveAll()
            .populate('artistId')
            .sort({ songName: 1 })
            .lean();
            
        res.render("songs/manage-songs", { songs, msg: req.query.msg || undefined });
    } catch (error) {
        console.error("manageSongs Error:", error);
        res.status(500).render('main/error-page', { error: "Management console unavailable." });
    } 
};

// Renders form to create a song
exports.createSongTemp = async (req, res) => {
    try {
        const [artists, genres] = await Promise.all([
            Artist.retrieveAll().sort({ artistName: 1 }).lean(),
            Genre.find().sort({ genreName: 1 }).lean()
        ]);

        res.render('songs/create-songs', { artists, genres, song: undefined });
    } catch (error) {
        console.error("createSongTemp Error:", error);
        res.status(500).render('main/error-page', { error: "Could not load form data." });
    }
};

// Handles POST to save song
exports.createSong = async (req, res) => {
    try {
        const { imageData, songName, artistId, genreId } = req.body;

        if (!songName || !artistId) {
            return res.status(400).json({ success: false, message: "Song name and Artist are required." });
        }

        const newSong = new Songs({
            songName,
            artistId, 
            albumCover: imageData || "default_album.jpg",
            genreId
        });

        await newSong.save();
        res.status(201).json({ success: true, message: "New Song Created Successfully" });
    } catch (error) {
        console.error("createSong Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Renders form to update existing song
exports.updateSongsPage = async (req, res) => {
    try {
        const songId = req.body.song || req.params.id; // Support both body and param
        
        const [song, artists, genres] = await Promise.all([
            Songs.findById(songId).populate('artistId').populate('genreId').lean(),
            Artist.retrieveAll().sort({ artistName: 1 }).lean(),
            Genre.find().sort({ genreName: 1 }).lean()
        ]);

        if (!song) return res.status(404).render('error-page', { error: "Song not found" });

        res.render('songs/create-songs', { artists, song, genres });
    } catch (error) {
        console.error("updateSongsPage Error:", error);
        res.status(500).render('main/error-page', { error: "Could not load song data." });
    }
};

// Handles the logic to update DB
exports.updateSongs = async (req, res) => {
    try {
        const { songId, songName, artistId, genreId, imageData } = req.body;

        const updateFields = { songName, artistId, genreId };
        if (imageData) updateFields.albumCover = imageData;

        const updatedSong = await Songs.findByIdAndUpdate(songId, updateFields, { new: true });
        
        if (!updatedSong) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        res.json({ success: true, message: "Update successful!" });
    } catch (error) {
        console.error("updateSongs Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteSongs = async (req, res) => {
    try {
        const { songId } = req.body;

        const songToDelete = await Songs.findById(songId);
        if (!songToDelete) {
            return res.status(404).render('main/error-page', { error: "Song not found" });
        }

        const deletedName = songToDelete.songName;
        
        // Clean up: Delete the song and all associated reviews
        await Promise.all([
            Songs.findByIdAndDelete(songId),
            Review.deleteMany({ songId: songId })
        ]);

        // Redirect or re-render management page
        const songs = await Songs.find().populate('artistId').lean();
        res.render('songs/manage-songs', { 
            songs, 
            msg: `Successfully deleted "${deletedName}" and its reviews.` 
        });
    } catch (error) {
        console.error("deleteSongs Error:", error);
        res.status(500).render('main/error-page', { error: "Deletion failed." });
    }
};