const Artist = require('../models/artist-model');
const Genre = require('../models/genre-model')
const countries = require('../data/countries-data.json')

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

// READ: Show Artists Page
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
            msg: null
        });
    } catch (error) {
        res.render("error-page", { error: "An error occurred loading the artist management page" });
    }
};

// READ: Show Artist Details
exports.showArtistDetails = async (req, res) => {
    try {
        const artistId = req.query.id;

        const artist = await Artist.findById(artistId).populate('artistGenre');

        if (!artist) {
            return res.render("error-page", { error: "Artist Not Found!" });
        }

        res.render("artist-details", { artist });
    } catch (error) {
        res.render("error-page", { error: "Error Loading Artist Profile." });
    }
};

// CREATE: Show Create Artist Page
exports.showCreateArtistPage = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1});

        res.render("create-artist", {
            genres: genres,
            countries: countries,
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
            artistImage: req.body.artistImage || "default_artist.png",
            artistName: req.body.artistName,
            artistGender: req.body.artistGender,
            artistGenre: genreArray,
            artistBio: req.body.artistBio,
            artistCountry: req.body.artistCountry     
        });

        const artists = await Artist.retrieveAll().populate('artistGenre');

        res.render("manage-artists", {
            artists: artists,
            msg: "Artist Successfully Created!"
        });
    } catch (error) {
        res.render("error-page", { error: "Failed to Create Artist."});
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

        //* Pass artist, all genres, and all countries to the view
        res.render("update-artist", { artist, genres, countries });
    } catch (error) {
        res.render("error-page", { error: "Error Loading Update Artist Page." });
    }
}

// UPDATE: Process Updating of Artist
exports.processUpdateArtist = async (req, res) => {
    try {
        const { artistId, artistBio, artistGender, artistCountry } = req.body;
        const artistImage = req.body.artistImage || "default_artist.png";
        let artistGenre = req.body.artistGenre;

        //* Ensure genreData is always an Array
        let genreArray = Array.isArray(artistGenre) ? artistGenre : (artistGenre ? [artistGenre] : []);

        //* Pass updated fields to Model
        await Artist.updateArtist(artistId, {
            artistGenre: genreArray,
            artistBio: artistBio,
            artistGender: artistGender,
            artistImage: artistImage,
            artistCountry: artistCountry
        });

        const artists = await Artist.retrieveAll().populate('artistGenre');
        res.render("manage-artists", {
            artists: artists,
            msg: "Artist Details Updated Successfully!"
        });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Failed to Update Artist Details."});
    }
};

// DELETE: Process Deletion of Artist
exports.processDeleteArtist = async (req, res) => {
    try {
        await Artist.deleteById(req.body.artistId);

        const artists = await Artist.retrieveAll().populate('artistGenre');

        res.render("manage-artists", {
            artists: artists,
            msg: "Artist Deleted Successfully!"
        })
    } catch (error) {
        console.error("Error Deleting Artist:", error);
        res.render("error-page", {
            error: "Failed to Delete Artist. Please Try Again Later."
        });
    }
};