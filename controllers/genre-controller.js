const Genre = require("../models/genre-model");

// Public page: users can browse all genres
exports.browseGenres = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1 });
        res.render("browse-genres", { genres });
    } catch (error) {
        console.log(error);
        res.send("Error loading genres");
    }
};

// Admin page: display all genres for management
exports.manageGenres = async (req, res) => {
    try {
        const genres = await Genre.find().sort({ genreName: 1 });
        res.render("manage-genres", { genres });
    } catch (error) {
        console.log(error);
        res.send("Error loading genre manager");
    }
};

// Show form to create new genre
exports.showCreateGenreForm = (req, res) => {
    res.render("create-genre");
};

// Create a new genre in MongoDB
exports.createGenre = async (req, res) => {
    try {
        const { genreName, description } = req.body;

        await Genre.create({
            genreName,
            description
        });

        res.redirect("/genres/manage");
    } catch (error) {
        console.log(error);
        res.send("Error creating genre");
    }
};

// Show edit form for selected genre
exports.showUpdateGenreForm = async (req, res) => {
    try {
        const genreId = req.body.genreId;
        const genre = await Genre.findById(genreId);

        if (!genre) {
            return res.send("Genre not found");
        }

        res.render("update-genre", { genre });
    } catch (error) {
        console.log(error);
        res.send("Error loading genre");
    }
};

// Update selected genre
exports.updateGenre = async (req, res) => {
    try {
        const { genreId, genreName, description } = req.body;

        await Genre.findByIdAndUpdate(genreId, {
            genreName,
            description
        });

        res.redirect("/genres/manage");
    } catch (error) {
        console.log(error);
        res.send("Error updating genre");
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
        res.send("Error deleting genre");
    }
};