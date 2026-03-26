const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    genreName: {
        type: String,
        required: [true, "A genre must have a name"], // Makes genre name compulsory
        unique: true, // Prevents duplicate genre names like 2 "Pop"
        trim: true // Removes extra spaces at the start/end
    },
    description: {
        type: String,
        default: "" // If user does not type anything, description is just empty
    }
});

// Creates the Genre model
// "Genre" is the model name
// "genres" is the MongoDB collection name
const Genre = mongoose.model("Genre", genreSchema, "genres");

// Exports the model so controller can use Genre.find(), Genre.create(), etc.
module.exports = Genre;