const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: [true, 'A review must belong to a song']
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'A review must have a comment']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to a user']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema,'reviews');


