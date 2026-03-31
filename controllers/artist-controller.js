const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model');
const Songs = require('../models/song-model');
const countries = require('../data/countries-data.json');

/**
 * @route   GET /browse
 * @desc    This renders the page to view all artists.
 * @access  Private (Requires Login)
 */
exports.browseArtists = async (req, res) => {
    try {
        // Retrieves all artists and populate linked genre documents
        const artists = await Artist.retrieveAll();
        res.render("browse-artists", { 
            artists, 
            isAdmin: req.session.role === 'admin' });
    } catch (error) {
        res.render("error-page", { error: "An error occurred loading the artist library." });
    }
}

/**
 * @route   GET /manage
 * @desc    This renders the authenticated view for managing Artists.
 * @access  Private (Admin Only)
 */
exports.showArtistPage = async (req, res) => {
    try {
        const artists = await Artist.retrieveAll();

        //*Capture flash messages from session
        const msg = req.session.msg || null;
        const error = req.session.error || null;

        //* Clear messages from session so they only display once
        req.session.msg = null;
        req.session.error = null;

        res.render("manage-artists", {
            username: req.session.username,
            artists: artists,
            isAdmin: req.session.role === 'admin',
            msg: msg,
            error: error
        });
    } catch (error) {
        res.render("error-page", { error: "An error occurred loading the artist management page" });
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
            return res.render("error-page", { error: "Artist Not Found!" });
        }

        const artistSongs = await Songs.find({ artistName: artist.artistName }).lean();

        res.render("artist-details", {
            artist,
            songs: artistSongs,
            isAdmin: req.session.role === 'admin'
        });
    } catch (error) {
        res.render("error-page", { error: "Error Loading Artist Profile." });
    }
};

/**
 * @route   POST /browse
 * @desc    Search Artists by Name on the browse-artists Page.
 * @access  Private (Requires Login)
 */
exports.searchArtists = async (req, res) => {
    try {
        const searchTerm = req.body.artistSearch ? req.body.artistSearch.trim() : "";

        if (searchTerm === "") {
            const artists = await Artist.retrieveAll();
            return res.render("browse-artists", {
                artists,
                search: "",
                msg: "Please Enter a Name to Search.",
                isAdmin: req.session.role === 'admin'
            });
        }

        const artists = await Artist.search(searchTerm);

        let validationMsg = null;
        if (artists.length === 0) {
            validationMsg = `No Artists Found Matching "${searchTerm}".`;
        }

        res.render("browse-artists", {
            artists,
            search: searchTerm,
            msg: validationMsg,
            isAdmin: req.session.role === 'admin'
        });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "An error occurred during search." });
    }
};

/**
 * @route   POST /manage
 * @desc    Search Artists by Name on the manage-artists Page.
 * @access  Private (Admin Only)
 */
exports.searchManageArtists = async (req, res) => {
    try {
        const searchTerm = req.body.artistSearch ? req.body.artistSearch.trim() : "";

        if (searchTerm === "") {
            const artists = await Artist.retrieveAll();
            return res.render("manage-artists", {
                artists,
                search: "",
                error: "Please Enter a Name to Search.",
                username: req.session.username,
                isAdmin: req.session.role === 'admin'
            });
        }

        const artists = await Artist.search(searchTerm);

        let validationMsg = null;
        if (searchTerm && artists.length === 0) {
            validationMsg = `No Artists Found Matching "${searchTerm}".`;
        }

        res.render("manage-artists", {
            username: req.session.username,
            artists: artists,
            search: searchTerm,
            msg: validationMsg,
            isAdmin: req.session.role === 'admin',
            error: null
        });
    } catch (error) {
        console.error(error);
        res.render("error-page", { error: "An error occurred during the search. Please try again later." })
    }
}

/**
 * @route   GET /create
 * @desc    Show Create Artist Page. Retrieves Genres from MongoDB and Countries from countries-data.json for dropdowns.
 * @access  Private (Admin Only)
 */
exports.showCreateArtistPage = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();

        res.render("create-artist", {
            genres: genres,
            countries: countries,
            isAdmin: req.session.role === 'admin',
            msg: "",
        });
    } catch (error) {
        res.render("error-page", { error: "Could not load genres for the form." })
    }
};

/**
 * @route   POST /create
 * @desc    Creation Process of an Artist with Input Validation
 * @access  Private (Admin Only)
 */
exports.processAddArtist = async (req, res) => {
    const { artistName, artistGender, artistGenre, artistBio, artistCountry, artistImage } = req.body;
    let missingFields = [];

    if (!artistName || artistName.trim() === "") missingFields.push("Artist Name");
    if (!artistGender) missingFields.push("Artist Gender");
    if (!artistBio || artistBio.trim() === "") missingFields.push("Artist Biography");
    if (!artistCountry || artistCountry === "") missingFields.push("Artist Country");
    if (!artistGenre || (Array.isArray(artistGenre) && artistGenre.length === 0)) missingFields.push("Select at Least One Genre");

    // Form validation fail: Render so req.body data is retained in the form
    if (missingFields.length > 0) {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();
        return res.render("create-artist", {
            genres,
            countries,
            missingFields: missingFields,
            artist: req.body,
            isAdmin: req.session.role === 'admin',
            msg: null
        });
    }

    try {
        let genreData = req.body.artistGenre;
        let genreArray = [];
        if (Array.isArray(genreData)) {
            genreArray = genreData;
        } else if (genreData) {
            genreArray = [genreData];
        }

        await Artist.createArtist({
            artistImage: req.body.artistImage || "default_artist.png",
            artistName: req.body.artistName,
            artistGender: req.body.artistGender,
            artistGenre: genreArray,
            artistBio: req.body.artistBio,
            artistCountry: req.body.artistCountry
        });

        // Set success message in session and redirect
        req.session.msg = "Artist Successfully Created!";
        return res.redirect('/artists/manage');

    } catch (error) {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();
        const errorMessage = (error.code === 11000)
            ? "ERROR: An Artist with that name already exists."
            : "ERROR: Could not create artist. Please check all fields.";

        // Form fail: Render to retain input data
        return res.render("create-artist", {
            genres,
            countries,
            isAdmin: req.session.role === 'admin',
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
        const id = req.query.id;
        const artist = await Artist.findById(id);
        const genres = await Genre.find().sort({ genreName: 1 }).lean();

        if (!artist) {
            return res.render("error-page", { error: "Artist not found" });
        }

        res.render("update-artist", {
            artist,
            genres,
            countries,
            isAdmin: req.session.role === 'admin'
        });
    } catch (error) {
        res.render("error-page", { error: "Error Loading Update Artist Page." });
    }
}

/**
 * @route   POST /update
 * @desc    Update Process of Artist. Updates the MongoDB data with Input Validation
 * @access  Private (Admin Only)
 */
exports.processUpdateArtist = async (req, res) => {
    const { artistId, artistName, artistBio, artistGender, artistCountry, artistImage } = req.body;
    let artistGenre = req.body.artistGenre;
    let missingFields = [];

    if (!artistName || artistName.trim() === "") missingFields.push("Artist Name");
    if (!artistGender) missingFields.push("Artist Gender");
    if (!artistBio || artistBio.trim() === "") missingFields.push("Artist Biography");
    if (!artistCountry || artistCountry === "") missingFields.push("Artist Country");

    let genreArray = [];

    if (artistGenre) {
        genreArray = Array.isArray(artistGenre) ? artistGenre : [artistGenre];
    }

    if (genreArray.length === 0) {
        missingFields.push("At Least One Genre Must Be Selected!")
    }

    // Form validation fail: Render so req.body data is retained
    if (missingFields.length > 0) {
        const genres = await Genre.find().sort({ genreName: 1 }).lean();
        return res.render("update-artist", {
            _id: artistId,
            genres,
            countries,
            missingFields: missingFields,
            artist: {
                _id: artistId,
                artistName: req.body.artistName,
                artistBio: req.body.artistBio,
                artistGender: req.body.artistGender,
                artistCountry: req.body.artistCountry,
                artistImage: req.body.artistImage,
                artistGenre: genreArray
            },
            isAdmin: req.session.role === 'admin'
        });
    }

    try {
        await Artist.updateArtist(artistId, {
            artistName: artistName,
            artistGenre: genreArray,
            artistBio: artistBio,
            artistGender: artistGender,
            artistImage: artistImage || "default_artist.png",
            artistCountry: artistCountry
        });

        // Set success message in session and redirect
        req.session.msg = "Artist Details Updated Successfully!";
        return res.redirect('/artists/manage');

    } catch (error) {
        const genres = await Genre.find().sort({ genreName: 1 });
        const errorMessage = (error.code === 11000)
            ? "ERROR: An Artist with that name already exists."
            : "ERROR: Could not update artist. Please check all fields.";

        // Form fail: Render to retain input data
        return res.render("update-artist", {
            artist: {
                _id: artistId,
                artistName: req.body.artistName,
                artistBio: req.body.artistBio,
                artistGender: req.body.artistGender,
                artistCountry: req.body.artistCountry,
                artistImage: req.body.artistImage,
                artistGenre: genreArray
            },
            genres,
            countries,
            isAdmin: req.session.role === 'admin',
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
        const artistId = req.body.artistId;
        const artist = await Artist.findById(artistId);

        if (!artist) {
            return res.render("error-page", { error: "Artist not found." });
        }

        const songsByArtists = await Songs.find({ artist: artist._id }).lean();

        if (songsByArtists.length > 0) {
            // Set error message in session and redirect
            req.session.error = `Cannot Delete Artist ${artist.artistName}: This Artist has ${songsByArtists.length} song(s) in the library.`;
            return res.redirect('/artists/manage');
        }

        await Artist.deleteById(artistId);

        // Set success message in session and redirect
        req.session.msg = "Artist Deleted Successfully!";
        return res.redirect('/artists/manage');

    } catch (error) {
        console.error("Error Deleting Artist:", error);
        res.render("error-page", {
            error: "Failed to Delete Artist. Please Try Again Later."
        });
    }
};