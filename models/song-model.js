const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({ 
    songName: {
        type: String,
        required: [true, 'A song must have a name']             
    },
    artistName: {
        type: String,
        required: [true, 'A song must be associated to an artist']
    },
    avgRating: {
        type: Number,
        default: 0
    },
    albumCover: {
        type: String,
        required: [true, 'Each song should have an album cover']
    }
});

const Songs = mongoose.model('Song', songSchema, 'songs');

// --- Your Custom Methods ---
// We attach them directly to the Songs object so they are exported together

Songs.retrieveAll = () => {
    return Songs.find();
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

// THE MOST IMPORTANT PART:
// We export the model itself. In Node, when you use "exports.name", 
// it adds things to the module.exports object automatically.
module.exports = Songs;