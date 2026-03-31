//* Tidied with Comments (Dex)

const mongoose = require('mongoose');

/**
 * Artist Schema
 * - Represents the structure of the Artist 'Table' in MongoDB
 */
const artistSchema = new mongoose.Schema({
    artistName: { 
        type: String, 
        required: [true, 'Artist Name is Required.'], 
        unique: true
    },
    artistGenre: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre', // Reference to the Genre Model
        required: [true, 'At least one genre is required.']
    }],
    artistBio: { 
        type: String, 
        required: [true, 'Artist Biography is Required.']
    },
    artistCountry: { 
        type: String, 
        required: [true, 'Country of Artist is Required.']
    },
    artistGender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], // Restricts input to these strings
        required: [true, 'Artist Gender is Required.']
    },
    artistImage: { 
        type: String, 
        default: "default_artist.png" // Fallback if no image is uploaded
    }, 
    artistFollowers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User Model
    }],
    artistDateAdded: { 
        type: Date, 
        default: Date.now 
    }
});

// Compile Schema into Mongoose Model
const Artist = mongoose.model('Artist', artistSchema);

/* =========================================
    Model Functions / Database Operations
=========================================== */

/**
 * Retrieves all artists from the database.
 * Populates 'artistGenre' array with actual Genre items
 * @returns {Promise<Array>} Lists of all Artists
 */
exports.retrieveAll = () => {
    return Artist.find().populate('artistGenre').lean();
};

/**
 * Inserts New Artist into the database
 * @param {Object} artist - Artist data object from Controller
 * @returns {Promise<Object>} Newly Created Artist
 */
exports.createArtist = (artist) => {
    return Artist.create(artist);
};

/**
 * Finds a single artist by their unique MongoDB Object ID
 * @param {String} id - MongoDB _id String unique to the Artist
 * @returns {Promise<Object>} The Artist that's been found from MongoDB
 */
exports.findById = (id) => {
    return Artist.findById(id);
};

/**
 * Deletes a single artist by their unique MongoDB Object ID
 * @param {String} id - MongoDB _id String unique to the Artist
 * @returns {Promise<Object>} The Artist that's been deleted from MongoDB
 */
exports.deleteById = (id) => {
    return Artist.findByIdAndDelete(id);
};

/**
 * Updates a single artist by their unique MongoDB Object ID
 * @param {*} id - MongoDB _id String unique to the Artist to update
 * @param {*} data - Object containing the updated fields
 * @returns {Promise<Object>} The Artist that's been updated from MongoDB
 */
exports.updateArtist = (id, data) => {
    return Artist.updateOne({ _id: id }, data);
};

/**
 * Searches for Artist by Name using a Case-Insensitive Partial Match
 * @param {String} searchTerm - The string entered by the user in the search bar
 * @returns {Promise<Array>} - A list of Artists that match the query with their genre data populated.
 */
exports.search = (searchTerm) => {
    let query = {};

    // If the user search term exists, build the regex query
    if (searchTerm) {
        /**
         * $regex: For partial matching of text
         * $options: 'i' for case-insensitive
         */
        query.artistName = { $regex: searchTerm, $options: 'i' };
    }
    return Artist.find(query).populate('artistGenre');
}

/**
 * Adds a User's ID to an Artist's Follower List.
 * Uses $addToSet to ensure UserID is unique
 * @param {String} artistId - Unique MongoDB ID of the Artist
 * @param {String} userId - Unique  ID of the User following the Artist
 * @returns {Promise} - Updates the Result
 */
exports.addFollower = (artistId, userId) => {
    return Artist.updateOne(
        { _id: artistId }, 
        { $addToSet: { artistFollowers: userId}});
}

/**
 * Remove a User's ID from an Artist's Follower List.
 * Uses $pull to ensure UserID is unique
 * @param {String} artistId - Unique MongoDB ID of the Artist
 * @param {String} userId - Unique  ID of the User following the Artist
 * @returns {Promise} - Updates the Result
 */
exports.removeFollower = (artistId, userId) => {
    return Artist.updateOne(
        { _id: artistId }, 
        { $pull: { artistFollowers: userId } });
};