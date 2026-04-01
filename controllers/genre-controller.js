const Genre = require("../models/genre-model");
const Artist = require("../models/artist-model");
const Songs = require("../models/song-model");

// Public page: users can browse all genres
exports.browseGenres = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1 });
        res.render("browse-genres", { genres });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to load browse genre page. Please try again later." });
    }
};

// Admin page: display all genres for management
exports.manageGenres = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1 });
        res.render("manage-genres", {
            genres
        });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to load genre management page. Please try again later." });
    }
};

// Show form to create new genre
exports.showCreateGenreForm = (req, res) => {
    res.render("create-genre", {
        msg: null,
        genre: {
            genreName: "",
            description: "",
            originYear: "",
            coverImage: "default_genre.avif",
            regionOrigin: "",
            notableStyle: ""
        }
    });
};

// Create a new genre in MongoDB
exports.createGenre = async (req, res) => {
    try {
        let {
            genreName,
            description,
            originYear,
            coverImage,
            regionOrigin,
            notableStyle
        } = req.body;

        let errors = [];

        genreName = genreName ? genreName.trim() : "";
        description = description ? description.trim() : "";
        coverImage = coverImage ? coverImage.trim() : "default_genre.avif";
        regionOrigin = regionOrigin ? regionOrigin.trim() : "";
        notableStyle = notableStyle ? notableStyle.trim() : "";

        if (genreName === "") {
            errors.push("Genre name is required.");
        }

        let parsedOriginYear = null;
        if (originYear && originYear.trim() !== "") {
            parsedOriginYear = Number(originYear);
            if (!Number.isInteger(parsedOriginYear) || parsedOriginYear < 0 || parsedOriginYear > new Date().getFullYear()) {
                errors.push("Origin year must be a valid year.");
            }
        }

        const existingGenre = await Genre.findOne({ genreName });
        if (existingGenre) {
            errors.push("A genre with this name already exists.");
        }

        if (errors.length > 0) {
            return res.render("create-genre", {
                msg: errors.join(" "),
                genre: {
                    genreName,
                    description,
                    originYear,
                    coverImage,
                    regionOrigin,
                    notableStyle
                }
            });
        }

        await Genre.create({
            genreName,
            description,
            originYear: parsedOriginYear,
            coverImage,
            regionOrigin,
            notableStyle
        });

        res.redirect("/genres/manage");
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to create genre. Please check your inputs and try again." });
    }
};

// Show edit form for selected genre
exports.showUpdateGenreForm = async (req, res) => {
    try {
        const genreId = req.body.genreId;
        const genre = await Genre.findById(genreId);

        if (!genre) {
            return res.render("error-page", { error: "Genre not found." });
        }

        res.render("update-genre", {
            genre,
            msg: null
        });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to load genre. Please try again later." });
    }
};

// Update selected genre
exports.updateGenre = async (req, res) => {
    try {
        let {
            genreId,
            genreName,
            description,
            originYear,
            coverImage,
            regionOrigin,
            notableStyle
        } = req.body;

        let errors = [];

        genreName = genreName ? genreName.trim() : "";
        description = description ? description.trim() : "";
        coverImage = coverImage ? coverImage.trim() : "default_genre.avif";
        regionOrigin = regionOrigin ? regionOrigin.trim() : "";
        notableStyle = notableStyle ? notableStyle.trim() : "";

        if (genreName === "") {
            errors.push("Genre name is required.");
        }

        let parsedOriginYear = null;
        if (originYear && originYear.toString().trim() !== "") {
            parsedOriginYear = Number(originYear);
            if (!Number.isInteger(parsedOriginYear) || parsedOriginYear < 0 || parsedOriginYear > new Date().getFullYear()) {
                errors.push("Origin year must be a valid year.");
            }
        }

        const existingGenre = await Genre.findOne({
            genreName,
            _id: { $ne: genreId }
        });

        if (existingGenre) {
            errors.push("Another genre with this name already exists.");
        }

        if (errors.length > 0) {
            return res.render("update-genre", {
                msg: errors.join(" "),
                genre: {
                    _id: genreId,
                    genreName,
                    description,
                    originYear,
                    coverImage,
                    regionOrigin,
                    notableStyle
                }
            });
        }

        await Genre.findByIdAndUpdate(genreId, {
            genreName,
            description,
            originYear: parsedOriginYear,
            coverImage,
            regionOrigin,
            notableStyle
        });

        res.redirect("/genres/manage");
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to update genre. Please check your inputs and try again." });
    }
};

// Delete selected genre
exports.deleteGenre = async (req, res) => {
    try {
        const { genreId } = req.body;

        await Genre.findByIdAndDelete(genreId);

        res.redirect("/genres/manage");
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to delete genre. Please try again later." });
    }
};

exports.showGenreDetails = async (req, res) => {
    try {
        const genreId = req.query.id;

        const genre = await Genre.findById(genreId);

        if (!genre) {
            return res.render("error-page", { error: "Genre not found." });
        }

        const genreImageMap = {
            "Pop": "pop.png",
            "Hip-Hop": "hiphop.jpg",
            "Indie": "indie.jpg",
            "Alternative": "alternative.jpg",
            "R&B": "rb.jpg"
        };

        const genreImage =
            genre.coverImage && genre.coverImage !== "default_genre.avif"
                ? genre.coverImage
                : (genreImageMap[genre.genreName] || "default_genre.avif");

        const artists = await Artist.retrieveAll();

        const matchedArtists = artists.filter(artist =>
            artist.artistGenre.some(g => g._id.toString() === genreId)
        );

        const artistsWithSongsRaw = await Promise.all(
            matchedArtists.map(async (artist) => {
                const songs = await Songs.find({
                    artistName: artist.artistName,
                    genreName: genre.genreName
                });

                if (songs.length === 0) {
                    return null;
                }

                return {
                    artist,
                    songs
                };
            })
        );

        const artistsWithSongs = artistsWithSongsRaw.filter(item => item !== null);

        res.render("genre-details", {
            genre,
            genreImage,
            artistsWithSongs
        });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Unable to load genre details page. Please try again later." });
    }
};