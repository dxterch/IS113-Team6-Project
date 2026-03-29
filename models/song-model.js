const mongoose = require("mongoose");

const songSchema = new mongoose.Schema ({
    songID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: [true, 'A song must have an ID'],
        unique: true
        },   
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

//Methods here

exports.retrieveAll = () =>{
    return Songs.find();
};

exports.updateAvgRating = (_id, avgRating) =>{
    return Songs.updateOne({_id},{avgRating})
};

