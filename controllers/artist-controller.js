// ==========================================
// Imports
// ==========================================

/**
 * Built-in Node Modules
 * 'fs' is File System Operations (Read, Write, Delete files) on the computer
 */
const fs = require('fs');
const path = require('path');

/**
 * Database Models:
 * Referencing the Models to be able to 'talk' to the database.
 */
const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model');
const Songs = require('../models/song-model');
const User = require('../models/user-model');

/**
 * Utilities:
 * Imports predefined lists from the utils file for countries and genders
 */
const { COUNTRIES, GENDERS } = require('../utils/constants');

// ==========================================
// Helper Function
// ==========================================

/**
 * Takes one text string (Base64) that represents an image,
 * converts it back into a real picture, and save it
 */
const saveBase64Image = (base64String, artistName) => {
    // Check if input is a valid Base64 string from Data URL. If not, stop the code and return null.
    if (!base64String || typeof base64String !== 'string' || !base64String.includes(';base64,')) {
        console.error("Invalid Base64 string provided to saveBase64Image");
        return null; 
    }

    // Split the string to check the file type (like png or jpg) and raw image data
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    /**
     * Change 'jpeg' to 'jpg', if not got 2 different file type but similar (jpeg, jpg), 
     * then translate this text into binary using buffer.
     */
    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Create unique file name using current exact time and artist name
    const filename = `${Date.now()}-${artistName.replace(/\s+/g, '').toLowerCase()}.${extension}`;
    
    // Save the file to /public/images/artists
    const uploadPath = path.join(__dirname, '../public/images/artists', filename);

    // Save the picture to the folder, then send the new file name back to be saved in the db
    fs.writeFileSync(uploadPath, buffer);
    return filename;
};

// ==========================================
// Controller Methods
// ==========================================

/**
 * @route   GET /browse
 * @desc    Loads the Browse Artist Page where users can look at all the available artists.
 * @access  Private (Requires Login)
 */
exports.browseArtists = async (req, res) => {
    try {
        // Retrieves all artists and send them to the webpage.
        const artists = await Artist.retrieveAll(); 
        return res.render("artists/browse-artists", { artists });
    } catch (error) {
        console.error("Browse Artists Error:", error);
        return res.render("main/error-page", { error: "An error occurred loading the artist library." });
    }
};

/**
 * @route   GET /manage
 * @desc    Load the administrator page where admins can manage artists
 * @access  Private (Admin Only)
 */
exports.showArtistPage = async (req, res) => {
    try {
        const artists = await Artist.retrieveAll();

        // Capture messages from session
        const { msg, error } = req.session;

        // Clear messages from session so they only display once
        req.session.msg = null;
        req.session.error = null;

        // Send objects to the manage artist page
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
 * @desc    This loads the Artist Details page. (Single Artist and their Songs)
 * @access  Private (Requires Login)
 */
exports.showArtistDetails = async (req, res) => {
    try {
        // Find specific artist by ID passed in web address
        const artistId = req.query.id;
        const artist = await Artist.findById(artistId).populate('artistGenre').lean();

        if (!artist) {
            return res.render("main/error-page", { error: "Artist Not Found!" });
        }

        // If someone deletes their account, remove them from artist's follower list
        if (artist.artistFollowers && artist.artistFollowers.length > 0) {
            // Check which followers still exist in User Database.
            const validUsers = await User.find({
                _id: { $in: artist.artistFollowers }
            }).select('_id').lean();

            // Update list with existing users
            artist.artistFollowers = validUsers.map(user => user._id.toString());
        } else {
            artist.artistFollowers = [];
        }

        // Find all songs that belong to the specific artist.
        const artistSongs = await Songs.retrieveAll({ artistId: artistId }).lean();

        // Send artist and songs objects to webpage.
        return res.render("artists/artist-details", {
            artist,
            songs: artistSongs,
            session: req.session
        });
    } catch (error) {
        console.error("Artist Details Error:", error);
        return res.render("main/error-page", { error: "An error occurred during trying to view artist details, please try again later!" });
    }
};

/**
 * @route   POST /browse
 * @desc    Search Artists by Name on the artists/browse-artists Page.
 * @access  Private (Requires Login)
 */
exports.searchArtists = async (req, res) => {
    try {
        // Retrieves user input from search bar and ignore empty spaces at the end
        const searchTerm = req.body.artistSearch ? req.body.artistSearch.trim() : "";

        // If user does not enter anything, displays all artists
        if (!searchTerm) {
            const artists = await Artist.retrieveAll();
            return res.render("artists/browse-artists", {
                artists,
                search: "",
                error: "Please Enter a Name to Search.",
            });
        }

        // Find artists that are matching the search term
        const artists = await Artist.search(searchTerm);

        // If no matching result, displays everyone and tells user nobody matches the searchTerm
        if (artists.length === 0) {
            const allArtists = await Artist.retrieveAll(); 
            return res.render("artists/browse-artists", {
                artists: allArtists, // Show everyone
                search: searchTerm,
                error: `No artists found matching "${searchTerm}". Showing all artists instead.`,
            });
        }

        // Show search results
        return res.render("artists/browse-artists", {
            artists,
            search: searchTerm,
            error: null,
        });
    } catch (error) {
        console.error("Artist Search Error:", error);
        return res.render("main/error-page", { error: "An error occurred during the searching of Artists, please try again later!." });
    }
};

/**
 * @route   POST /manage
 * @desc    Search Artists by Name on the artists/manage-artists Page.
 * @access  Private (Admin Only)
 */
exports.searchManageArtists = async (req, res) => {
    try {
        // Retrieves user input from search bar and ignore empty spaces at the end
        const searchTerm = req.body.artistSearch ? req.body.artistSearch.trim() : "";

        // If user does not enter anything, displays all artists
        if (!searchTerm) {
            const artists = await Artist.retrieveAll();
            return res.render("artists/manage-artists", {
                username: req.session.username,
                artists,
                search: "",
                error: "Please Enter a Name to Search.",  
            });
        }

        // Find artists that are matching the search term
        const artists = await Artist.search(searchTerm);

        // Check for errors and successes
        const errorMsg = artists.length === 0 ? `No artists found matching "${searchTerm}". Enter a valid artist!` : null;
        const validationMsg = artists.length === 0 ? `No Artists Found Matching "${searchTerm}".` : null;

        return res.render("artists/manage-artists", {
            username: req.session.username,
            artists,
            search: searchTerm,
            msg: validationMsg,
            error: errorMsg
        });
    } catch (error) {
        console.error("Search Manage Artists Error:", error);
        return res.render("main/error-page", { error: "An error occurred during the searching of Artists. Please try again later." });
    }
};

/**
 * @route   GET /create
 * @desc    Show Create Artist Page. Retrieves Genres and Countries for dropdowns.
 * @access  Private (Admin Only)
 */
exports.showCreateArtistPage = async (req, res) => {
    try {
        // Retrieves list of genres from database
        const genres = await Genre.find().sort({ genreName: 1 }).lean();

        return res.render("artists/create-artist", {
            genres,
            countries: COUNTRIES, // From constants.js file created
            genders: GENDERS, // From constants.js file created
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

    // All the user validations (Empty Checks)
    if (!artistName || artistName.trim() === "") missingFields.push("Artist Name");
    if (!artistGender) missingFields.push("Artist Gender");
    if (!artistBio || artistBio.trim() === "") missingFields.push("Artist Biography");
    if (!artistCountry) missingFields.push("Artist Country");
    if (!artistGenre || (Array.isArray(artistGenre) && artistGenre.length === 0)) missingFields.push("Select at Least One Genre");

    // If user forgots to enter anything
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

        // If user uploads a picture, save the pic, else use the default_artist picture.
        let newArtistImage = "default_artist.png";
        if (artistImageBase64) {
            const savedFileName = saveBase64Image(artistImageBase64, artistName);
            if (savedFileName) newArtistImage = savedFileName;
        }

        // Save new artist to database
        await Artist.createArtist({
            artistImage: newArtistImage,
            artistName,
            artistGender,
            artistGenre: genreArray,
            artistBio,
            artistCountry
        });

        // Set a success message and direct user to manage-artists page
        req.session.msg = "Artist Successfully Created!";
        return res.redirect('/artists/manage');

    } catch (error) {
        console.error("Create Artist Error:", error);

        // If artist name is taken OR empty fields, display error message
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
        // Finds the artist the user wants to edit
        const artist = await Artist.findById(req.query.id);
        const genres = await Genre.find().sort({ genreName: 1 }).lean();

        if (!artist) {
            return res.render("main/error-page", { error: "Artist not found" });
        }

        // Sends all the objects needed to preload the fields for the specific artist
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
    // Retrieves all required info, with hidden artistId and name of their old image
    const { artistId, artistName, artistBio, artistGender, artistCountry, artistImageBase64, existingArtistImage, artistGenre } = req.body;
    let missingFields = [];

    // Ensure genre is always an array
    const genreArray = artistGenre ? (Array.isArray(artistGenre) ? artistGenre : [artistGenre]) : [];

    // All the user validations (Empty Checks)
    if (!artistName || artistName.trim() === "") missingFields.push("Artist Name");
    if (!artistGender) missingFields.push("Artist Gender");
    if (!artistBio || artistBio.trim() === "") missingFields.push("Artist Biography");
    if (!artistCountry) missingFields.push("Artist Country");
    if (genreArray.length === 0) missingFields.push("At Least One Genre Must Be Selected!");

    // If the validations fail, displays the missingFields and retains the data
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

    // If user uploads a new picture, save the pic, else use their old picture.
    let updatedImage = existingArtistImage || "default_artist.png";
    if (artistImageBase64) {
        const savedFileName = saveBase64Image(artistImageBase64, artistName);
        if (savedFileName) updatedImage = savedFileName;
    }

    try {
        // Updating of the specific artist's data
        await Artist.updateArtist(artistId, {
            artistName,
            artistGenre: genreArray,
            artistBio,
            artistGender,
            artistImage: updatedImage,
            artistCountry
        });

        // Delete old image if new image has been uploaded.
        if (updatedImage !== existingArtistImage && existingArtistImage && existingArtistImage !== "default_artist.png") {
            const oldImagePath = path.join(__dirname, '../public/images/artists', existingArtistImage);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); 
        }

        req.session.msg = "Artist Details Updated Successfully!";
        return res.redirect('/artists/manage');

    } catch (error) {
        console.error("UPDATE ARTIST ERROR:", error); 

        // Revert newly saved image if database update fails. Delete the new picture since update failed
        if (updatedImage !== existingArtistImage && updatedImage !== "default_artist.png") {
             const newImagePath = path.join(__dirname, '../public/images/artists', updatedImage);
             if (fs.existsSync(newImagePath)) fs.unlinkSync(newImagePath);
        }
        
        // Reset image back to old image before returning to the update-artist page
        updatedImage = existingArtistImage || "default_artist.png";       
        const genres = await Genre.find().sort({ genreName: 1 });
        const errorMessage = (error.code === 11000)
            ? "ERROR: An Artist with that name already exists."
            : "ERROR: Could not update artist. Please check all fields.";

        // Renders the update-artist page for user to train again
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

        // If artists does not exist
        if (!artist) {
            req.session.error = "Artist not found.";
            return res.redirect('/artists/manage');
        }

        // Check if artist has any songs in the library
        const songsByArtists = await Songs.find({ artistId }).lean();

        // If artist has songs, block deletion. Admin must delete the song associated with the Artist
        if (songsByArtists.length > 0) {
            req.session.error = `Cannot Delete Artist ${artist.artistName}: This Artist has ${songsByArtists.length} song(s) in the library.`;
            return res.redirect('/artists/manage');
        }

        // Delete profile picture from the server (unless is the default image)
        if (artist.artistImage && artist.artistImage !== "default_artist.png") {
            const imagePath = path.join(__dirname, '../public/images/artists', artist.artistImage);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); 
        }

        // Delete from database
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

        // Check if user's ID is in the artist's list of followers
        const isFollowing = (artist.artistFollowers || []).map(id => id.toString()).includes(userId.toString());

        // Reflect the button (follow/unfollow)
        if (isFollowing) {
            await Artist.removeFollower(artistId, userId);
        } else {
            await Artist.addFollower(artistId, userId);
        }

        // Refresh page so button changes
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
        // Retrieve the list of followed artists the user is following
        const followedArtists = await Artist.getFollowedArtists(req.session.userId);
        return res.render("artists/artist-following", { artists: followedArtists });
    } catch (error) {
        console.error("View Followed Artists Error:", error);
        return res.render("main/error-page", { error: "Failed to load the artists you follow. Please try again later." });
    }
};