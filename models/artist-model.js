//* Tidied with Comments (Dex)

const mongoose = require('mongoose');
const { GENDERS } = require('../utils/constants');

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
        enum: GENDERS,
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
 * Checks follower list of specific artist and
 * Cross references the Artist's follower IDs and with Users
 * to ensure only existing users are returned
 * @param {String} artistId - Unique MongoDB Object ID of the Artist
 * @returns  {Promise<Object|null>} - Cleaned artist object with verified follower list
 */
exports.getCleanArtist = async (artistId) => {
    // Fetch the artist and populate genres
    const artist = await Artist.findById(artistId).populate('artistGenre').lean();

    if (!artist) return null;

    // Access the User model via mongoose rather than a top-level require
    const UserModel = mongoose.model('User'); 
    
    if (artist.artistFollowers?.length > 0) {
        const validUsers = await UserModel.find({
            _id: { $in: artist.artistFollowers }
        }).select('_id').lean();

        // Overwrite the list with only real, existing User IDs
        artist.artistFollowers = validUsers.map(user => user._id.toString());
    } else {
        artist.artistFollowers = [];
    }

    return artist;
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
    return Artist.find(query).populate('artistGenre').lean();
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

/**
 * Toggles a user's follow status for an artist.
 * Updates BOTH the Artist's followers and the User's following list.
 * @param {String} artistId - ID of the artist
 * @param {String} userId - ID of the current user
 * @returns {Promise<Object|null>} - The result of the update operation
 */
exports.toggleFollow = async (artistId, userId) => {
    const artist = await Artist.findById(artistId);
    if (!artist) return null;

    // Access the User model dynamically to avoid circular requirements
    const UserModel = mongoose.model('User');

    // Check if user is already in the followers array
    const isFollowing = artist.artistFollowers.some(id => id.toString() === userId.toString());

    if (isFollowing) {
        // --- UNFOLLOW PROCESS ---
        // 1. Remove User from Artist's list
        const artistUpdate = await Artist.updateOne({ _id: artistId }, { $pull: { artistFollowers: userId } });
        // 2. Remove Artist from User's list
        await UserModel.updateOne({ _id: userId }, { $pull: { following: artistId } });
        
        return artistUpdate;
    } else {
        // --- FOLLOW PROCESS ---
        // 1. Add User to Artist's list (using $addToSet to prevent duplicates)
        const artistUpdate = await Artist.updateOne({ _id: artistId }, { $addToSet: { artistFollowers: userId } });
        // 2. Add Artist to User's list
        await UserModel.updateOne({ _id: userId }, { $addToSet: { following: artistId } });
        
        return artistUpdate;
    }
};

/**
 * Finds all Artists that a specific user is following
 * @param {String} userId - The unique ID of the current logged-in user
 * @returns {Promise<Array>} List of followed artists
 */
exports.getFollowedArtists = async (userId) => {
    const UserModel = mongoose.model('User');
    const user = await UserModel.findById(userId).select('following').lean();
    
    if (!user || !user.following) return [];

    // Find all artists whose ID is in the user's following list
    return Artist.find({ _id: { $in: user.following } }).populate('artistGenre').lean();
};

/**
 * Search artist by their name
 * @param {String} name = Exact string name of artist
 * @returns {Promise<Object|null>} If artist is found, otherwise returns null
 */
exports.findArtistByName = (name) => {
    return Artist.findOne({artistName: name});
};

/**
 * Finds all artists associated with a specific genre
 * @param {String} genreId - Unique MongoDB ID of the Genre
 * @returns {Promise<Array>} List of artists matching the genre
 */
exports.findByGenre = (genreId) => {
    return Artist.find({ artistGenre: genreId }).lean();
};