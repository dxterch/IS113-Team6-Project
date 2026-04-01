const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    genreName: {
        type: String,
        required: [true, "A genre must have a name"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    originYear: {
        type: Number,
        default: null
    },
    coverImage: {
        type: String,
        default: "default_genre.avif",
        trim: true
    },
    regionOrigin: {
        type: String,
        default: "",
        trim: true
    },
    notableStyle: {
        type: String,
        default: "",
        trim: true
    }
});

// Creates the Genre model
// "Genre" is the model name
// "genres" is the MongoDB collection name
const Genre = mongoose.model("Genre", genreSchema, "genres");

// Exports the model so controller can use Genre.find(), Genre.create(), etc.
module.exports = Genre;