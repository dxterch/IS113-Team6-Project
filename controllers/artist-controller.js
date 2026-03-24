const Artist = require('../models/artist-model');

// READ: Show Artist Page
exports.showArtistPage = async (req, res) => {
    try {
        // If they are not logged in, redirect to login
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        // Fetch all artists to display on the management page
        const artists = await Artist.retrieveAll(); 

        res.render("manage-artists", {
            username: req.session.username,
            artists: artists
        });
    } catch (error) {
        console.error(error);
        res.send("An error occurred loading the artist management page.");
    }
};

// CREATE: Show Create Artist Page
exports.showCreateArtistPage = (req, res) => {
    return res.render("create-artist", { msg: "" });
};

// CREATE: Process Creation of Artist
exports.processAddArtist = async (req, res) => {
    try {
        await Artist.createArtist(req.body);
        res.redirect("/artists/manage");
    } catch (error) {
        console.log(error)
        res.render("create-artist", { msg: "Error Adding Artist. Name may already exist!"})
    }
};

// UPDATE: Show Update Artist Page
exports.showUpdateArtistPage = async (req, res) => {
    const artist = await Artist.findById(req.query.id);
    res.render("update-artist", { artist });
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