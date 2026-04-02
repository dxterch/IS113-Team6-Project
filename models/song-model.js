const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({ 
    songName: {
        type: String,
        required: [true, 'A song must have a name']             
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    // artistName: {
    //     type: String,
    //     required: [true, 'A song must be associated to an artist']
    // },
    avgRating: {
        type: Number,
        default: 0
    },
    albumCover: {
        type: String,
        required: [true, 'Each song should have an album cover']
    },
    genreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    }
});

const Songs = mongoose.model('Song', songSchema, 'songs');

// --- Your Custom Methods ---

Songs.retrieveAll = (query = {}) => {
    return Songs.find(query).populate('genreId').populate('artistId');
};

Songs.updateAvgRating = (_id, avgRating) => {
    return Songs.updateOne({ _id }, { avgRating });
};

Songs.findSong = (_id) => {
    return Songs.findById(_id);
};

Songs.createSong = (songData) => {
    return Songs.create(songData);
};

Songs.deleteId = (id) => {
    return Songs.findByIdAndDelete(id);
};

module.exports = Songs;