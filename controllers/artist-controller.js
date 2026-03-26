const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model')

// READ: Browse Artists Page
exports.browseArtists = async (req, res) => {
    try {
        //* Fetch all artists and populate the artistGenre array
        const artists = await Artist.retrieveAll().populate('artistGenre');

        res.render("browse-artists", { artists });
    } catch (error) {
        res.render("error-page", { error: "An error occurred loading the artist library."});
    }
}

// READ: Show Artist Page
exports.showArtistPage = async (req, res) => {
    try {
        // If they are not logged in, redirect to login
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        // Fetch all artists to display on the management page
        const artists = await Artist.retrieveAll().populate('artistGenre'); 

        res.render("manage-artists", {
            username: req.session.username,
            artists: artists,
        });
    } catch (error) {
        res.render("error-page", { error: "An error occurred loading the artist management page" });
    }
};

// CREATE: Show Create Artist Page
exports.showCreateArtistPage = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1});

        res.render("create-artist", {
            genres: genres,
            msg: "",
        });
    } catch (error) {
        res.render("error-page", { error: "Could not load genres for the form."})
    }
};

// CREATE: Process Creation of Artist
exports.processAddArtist = async (req, res) => {
    try {
        let genreData = req.body.artistGenre;

        // Make genreData an Array
        let genreArray = [];
        if (Array.isArray(genreData)) {
            genreArray = genreData;
        } else if (genreData) {
            genreArray = [genreData];
        }

        await Artist.createArtist({
            artistName: req.body.artistName,
            artistGenre: genreArray,
            artistBio: req.body.artistBio,
            artistCountry: req.body.artistCountry,
            artistPopularity: req.body.artistPopularity
        });

        res.redirect("/artists/manage");
    } catch (error) {
        res.render("error-page", { error: "Failed to create artist. "});
    }
};

// UPDATE: Show Update Artist Page
exports.showUpdateArtistPage = async (req, res) => {
    try {
        //* Get Artist ID from Query String
        const id = req.query.id;

        //* Fetch Artist and List of all Genres
        const artist = await Artist.findById(id);
        const genres = await Genre.find().sort({ genreName: 1});

        if (!artist) {
            return res.render("error-page", { error: "Artist not found" });
        }

        res.render("update-artist", { artist, genres });
    } catch (error) {
        res.render("error-page", { error: "Error Loading Update Artist Page" });
    }
}

// UPDATE: Process Updating of Artist
exports.processUpdateArtist = async (req, res) => {
    await Artist.updateArtist(req.body.artistId, {
        artistGenre: req.body.artistGenre,
        artistBio: req.body.artistBio,
        artistPopularity: req.body.artistPopularity
    });
    res.redirect("/artists/manage");
};

// DELETE: Process Deletion of Artist
exports.processDeleteArtist = async (req, res) => {
    await Artist.deleteById(req.body.artistId);
    res.redirect("/artists/manage");
}