// ==========================================
// Imports
// ==========================================

// 1. Built-in Node modules
const fs = require('fs');
const path = require('path');

// 2. Database Models
const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model');
const Songs = require('../models/song-model');
const User = require('../models/user-model');

// 3. Utilities / Constants
const { COUNTRIES, GENDERS } = require('../utils/constants');

// ==========================================
// Helper Functions
// ==========================================

/**
 * Helper function to decode Base64 and save it as a file using native Node modules
 */
const saveBase64Image = (base64String, artistName) => {
    // If not a string or is empty, stop immediately
    if (!base64String || typeof base64String !== 'string' || !base64String.includes(';base64,')) {
        console.error("Invalid Base64 string provided to saveBase64Image");
        return null; 
    }

    // Isolate the base64 data and the file extension from the string
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Create a unique filename
    const filename = `${Date.now()}-${artistName.replace(/\s+/g, '').toLowerCase()}.${extension}`;
    
    // Define where to save the file
    const uploadPath = path.join(__dirname, '../public/images/artists', filename);

    // Save the file synchronously 
    fs.writeFileSync(uploadPath, buffer);
    return filename;
};

// ==========================================
// Controller Methods
// ==========================================

/**
 * @route   GET /browse
 * @desc    This renders the page to view all artists.
 * @access  Private (Requires Login)
 */
exports.browseArtists = async (req, res) => {
    try {
        const artists = await Artist.retrieveAll(); // Retrieves all artists and populates linked genre documents
        return res.render("artists/browse-artists", { artists });
    } catch (error) {
        console.error("Browse Artists Error:", error);
        return res.render("main/error-page", { error: "An error occurred loading the artist library." });
    }
};

/**
 * @route   GET /manage
 * @desc    This renders the authenticated view for managing Artists.
 * @access  Private (Admin Only)
 */
exports.showArtistPage = async (req, res) => {
    try {
        const artists = await Artist.retrieveAll();

        // Capture flash messages from session
        const { msg, error } = req.session;

        // Clear messages from session so they only display once
        req.session.msg = null;
        req.session.error = null;

        return res.render("artists/manage-artists", {
            username: req.session.username,
            artists,
            msg,
            error
        });
    } catch (error) {
        console.error("Manage Artists Error:", error);
        return res.render("main/error-page", { error: "An error occurred loading the artist management page." });
    }
};

/**
 * @route   GET /details
 * @desc    This renders the Artist Details. (Single Artist and their Songs)
 * @access  Private (Requires Login)
 */
exports.showArtistDetails = async (req, res) => {
    try {
        const artistId = req.query.id;
        const artist = await Artist.findById(artistId).populate('artistGenre').lean();

        if (!artist) {
            return res.render("main/error-page", { error: "Artist Not Found!" });
        }

        if (artist.artistFollowers && artist.artistFollowers.length > 0) {
            // Query the User database to find which of these follower IDs still exist
            const validUsers = await User.find({
                _id: { $in: artist.artistFollowers }
            }).select('_id').lean();

            // Create a clean array of only the string IDs of users who still exist
            artist.artistFollowers = validUsers.map(user => user._id.toString());
        } else {
            artist.artistFollowers = [];
        }

        // Search for songs using the artist's unique ID instead of their name
        const artistSongs = await Songs.find({ artistId: artistId }).lean();

        return res.render("artists/artist-details", {
            artist,
            songs: artistSongs,
            session: req.session
        });
    } catch (error) {
        console.error("Artist Details Error:", error);
        return res.render("main/error-page", { error: "Error Loading Artist Profile." });
    }
};

/**
 * @route   POST /browse
 * @desc    Search Artists by Name on the artists/browse-artists Page.
 * @access  Private (Requires Login)
 */
exports.searchArtists = async (req, res) => {
    try {
        const searchTerm = req.body.artistSearch ? req.body.artistSearch.trim() : "";

        if (!searchTerm) {
            const artists = await Artist.retrieveAll();
            return res.render("artists/browse-artists", {
                artists,
                search: "",
                error: "Please Enter a Name to Search.",
            });
        }

        // Run the search
        const artists = await Artist.search(searchTerm);

        // No Results Found
        if (artists.length === 0) {
            const allArtists = await Artist.retrieveAll(); 
            return res.render("artists/browse-artists", {
                artists: allArtists, // Show everyone
                search: searchTerm,
                error: `No artists found matching "${searchTerm}". Showing all artists instead.`,
            });
        }

        return res.render("artists/browse-artists", {
            artists,
            search: searchTerm,
            error: null,
        });
    } catch (error) {
        console.error("Search Artists Error:", error);
        return res.render("main/error-page", { error: "An error occurred during search." });
    }
};

/**
 * @route   POST /manage
 * @desc    Search Artists by Name on the artists/manage-artists Page.
 * @access  Private (Admin Only)
 */
exports.searchManageArtists = async (req, res) => {
    try {
        const searchTerm = req.body.artistSearch ? req.body.artistSearch.trim() : "";

        if (!searchTerm) {
            const artists = await Artist.retrieveAll();
            return res.render("artists/manage-artists", {
                artists,
                search: "",
                error: "Please Enter a Name to Search.",
                username: req.session.username,
            });
        }

        const artists = await Artist.search(searchTerm);
        const validationMsg = artists.length === 0 ? `No Artists Found Matching "${searchTerm}".` : null;

        return res.render("artists/manage-artists", {
            username: req.session.username,
            artists,
            search: searchTerm,
            msg: validationMsg,
            error: null
        });
    } catch (error) {
        console.error("Search Manage Artists Error:", error);
        return res.render("main/error-page", { error: "An error occurred during the search. Please try again later." });
    }
};

/**
 * @route   GET /create
 * @desc    Show Create Artist Page. Retrieves Genres and Countries for dropdowns.
 * @access  Private (Admin Only)
 */
exports.showCreateArtistPage = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();

        return res.render("artists/create-artist", {
            genres,
            countries: COUNTRIES,
            genders: GENDERS,
            msg: "",
        });
    } catch (error) {
        console.error("Show Create Artist Page Error:", error);
        return res.render("main/error-page", { error: "Could not load genres for the form." });
    }
};

/**
 * @route   POST /create
 * @desc    Creation Process of an Artist with Input Validation
 * @access  Private (Admin Only)
 */
exports.processAddArtist = async (req, res) => {
    const { artistName, artistGender, artistGenre, artistBio, artistCountry, artistImageBase64 } = req.body;
    let missingFields = [];

    // Validation
    if (!artistName || artistName.trim() === "") missingFields.push("Artist Name");
    if (!artistGender) missingFields.push("Artist Gender");
    if (!artistBio || artistBio.trim() === "") missingFields.push("Artist Biography");
    if (!artistCountry) missingFields.push("Artist Country");
    if (!artistGenre || (Array.isArray(artistGenre) && artistGenre.length === 0)) missingFields.push("Select at Least One Genre");

    // Form validation fail: Render so req.body data is retained in the form
    if (missingFields.length > 0) {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();
        return res.render("artists/create-artist", {
            genres,
            countries: COUNTRIES,
            genders: GENDERS,
            missingFields,
            artist: req.body,
            msg: null
        });
    }

    try {
        // Ensure genre is always an array
        const genreArray = artistGenre ? (Array.isArray(artistGenre) ? artistGenre : [artistGenre]) : [];

        // Process the Base64 image using our helper function
        let newArtistImage = "default_artist.png";
        if (artistImageBase64) {
            const savedFileName = saveBase64Image(artistImageBase64, artistName);
            if (savedFileName) newArtistImage = savedFileName;
        }

        await Artist.createArtist({
            artistImage: newArtistImage,
            artistName,
            artistGender,
            artistGenre: genreArray,
            artistBio,
            artistCountry
        });

        req.session.msg = "Artist Successfully Created!";
        return res.redirect('/artists/manage');

    } catch (error) {
        console.error("Create Artist Error:", error);
        const genres = await Genre.find().sort({ genreName: 1 }).lean();
        const errorMessage = (error.code === 11000)
            ? "ERROR: An Artist with that name already exists."
            : "ERROR: Could not create artist. Please check all fields.";

        return res.render("artists/create-artist", {
            genres,
            countries: COUNTRIES,
            genders: GENDERS,
            msg: errorMessage,
            artist: req.body
        });
    }
};

/**
 * @route   GET /update
 * @desc    Show Update Artist Page. Retains existing form data as well.
 * @access  Private (Admin Only)
 */
exports.showUpdateArtistPage = async (req, res) => {
    try {
        const artist = await Artist.findById(req.query.id);
        const genres = await Genre.find().sort({ genreName: 1 }).lean();

        if (!artist) {
            return res.render("main/error-page", { error: "Artist not found" });
        }

        return res.render("artists/update-artist", {
            artist,
            genres,
            genders: GENDERS,
            countries: COUNTRIES,
        });
    } catch (error) {
        console.error("Show Update Artist Page Error:", error);
        return res.render("main/error-page", { error: "Error Loading Update Artist Page." });
    }
};

/**
 * @route   POST /update
 * @desc    Update Process of Artist. Updates the MongoDB data with Input Validation
 * @access  Private (Admin Only)
 */
exports.processUpdateArtist = async (req, res) => {
    const { artistId, artistName, artistBio, artistGender, artistCountry, artistImageBase64, existingArtistImage, artistGenre } = req.body;
    let missingFields = [];

    // Ensure genre is always an array
    const genreArray = artistGenre ? (Array.isArray(artistGenre) ? artistGenre : [artistGenre]) : [];

    // Validation
    if (!artistName || artistName.trim() === "") missingFields.push("Artist Name");
    if (!artistGender) missingFields.push("Artist Gender");
    if (!artistBio || artistBio.trim() === "") missingFields.push("Artist Biography");
    if (!artistCountry) missingFields.push("Artist Country");
    if (genreArray.length === 0) missingFields.push("At Least One Genre Must Be Selected!");

    // Form validation fail: Render so req.body data is retained
    if (missingFields.length > 0) {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();
        return res.render("artists/update-artist", {
            _id: artistId,
            genres,
            genders: GENDERS,
            countries: COUNTRIES,
            missingFields,
            artist: {
                _id: artistId,
                artistName,
                artistBio,
                artistGender,
                artistCountry,
                artistImage: existingArtistImage || "default_artist.png",
                artistImageBase64,
                artistGenre: genreArray
            },
        });
    }

    // Only process/save the new image AFTER validation passes
    let updatedImage = existingArtistImage || "default_artist.png";
    if (artistImageBase64) {
        const savedFileName = saveBase64Image(artistImageBase64, artistName);
        if (savedFileName) updatedImage = savedFileName;
    }

    try {
        await Artist.updateArtist(artistId, {
            artistName,
            artistGenre: genreArray,
            artistBio,
            artistGender,
            artistImage: updatedImage,
            artistCountry
        });

        // Cleanup old image if a new one was uploaded
        if (updatedImage !== existingArtistImage && existingArtistImage && existingArtistImage !== "default_artist.png") {
            const oldImagePath = path.join(__dirname, '../public/images/artists', existingArtistImage);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); 
        }

        req.session.msg = "Artist Details Updated Successfully!";
        return res.redirect('/artists/manage');

    } catch (error) {
        console.error("UPDATE ARTIST ERROR:", error); 

        // Revert newly saved image if database update fails
        if (updatedImage !== existingArtistImage && updatedImage !== "default_artist.png") {
             const newImagePath = path.join(__dirname, '../public/images/artists', updatedImage);
             if (fs.existsSync(newImagePath)) fs.unlinkSync(newImagePath);
        }
        
        updatedImage = existingArtistImage || "default_artist.png";       
        const genres = await Genre.find().sort({ genreName: 1 });
        const errorMessage = (error.code === 11000)
            ? "ERROR: An Artist with that name already exists."
            : "ERROR: Could not update artist. Please check all fields.";

        return res.render("artists/update-artist", {
            artist: {
                _id: artistId,
                artistName,
                artistBio,
                artistGender,
                artistCountry,
                artistImage: updatedImage,
                artistImageBase64,
                artistGenre: genreArray
            },
            genres,
            countries: COUNTRIES,
            genders: GENDERS,
            msg: errorMessage
        });
    }
};

/**
 * @route   POST /delete
 * @desc    Delete Process of Artist. Also restricts deletion if artist has songs
 * @access  Private (Admin Only)
 */
exports.processDeleteArtist = async (req, res) => {
    try {
        const { artistId } = req.body;
        const artist = await Artist.findById(artistId);

        if (!artist) {
            req.session.error = "Artist not found.";
            return res.redirect('/artists/manage');
        }

        const songsByArtists = await Songs.find({ artistId }).lean();

        if (songsByArtists.length > 0) {
            req.session.error = `Cannot Delete Artist ${artist.artistName}: This Artist has ${songsByArtists.length} song(s) in the library.`;
            return res.redirect('/artists/manage');
        }

        if (artist.artistImage && artist.artistImage !== "default_artist.png") {
            const imagePath = path.join(__dirname, '../public/images/artists', artist.artistImage);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); 
        }

        await Artist.deleteById(artistId);
        req.session.msg = `Artist ${artist.artistName} Deleted Successfully!`;
        return res.redirect('/artists/manage');

    } catch (error) {
        console.error("Delete Artist Error:", error);
        return res.render("main/error-page", { error: "Failed to Delete Artist. Please Try Again Later." });
    }
};

/**
 * @route   POST /artists/follow/:id
 * @desc    Allows a logged-in user to follow/unfollow an artist
 * @access  Private (Requires Login)
 */
exports.toggleFollowArtist = async (req, res) => {
    try {
        const { artistId } = req.body;
        const { userId } = req.session;
        const artist = await Artist.findById(artistId);

        if (!artist) {
            return res.render("main/error-page", { error: "Artist not found." });
        }

        const isFollowing = (artist.artistFollowers || []).map(id => id.toString()).includes(userId.toString());

        if (isFollowing) {
            await Artist.removeFollower(artistId, userId);
        } else {
            await Artist.addFollower(artistId, userId);
        }
        return res.redirect(`/artists/details?id=${artistId}`);
    } catch (error) {
        console.error("Toggle Follow Artist Error:", error);
        return res.render("main/error-page", { error: "An Error Occurred while trying to follow the Artist. Please try again later!" });
    }
};

/**
 * @route   GET /artists/following
 * @desc    View artists the user is currently following
 * @access  Private (Requires Login)
 */
exports.viewFollowedArtists = async (req, res) => {
    try {
        const followedArtists = await Artist.getFollowedArtists(req.session.userId);
        return res.render("artists/artist-following", { artists: followedArtists });
    } catch (error) {
        console.error("View Followed Artists Error:", error);
        return res.render("main/error-page", { error: "Failed to load the artists you follow. Please try again later." });
    }
};