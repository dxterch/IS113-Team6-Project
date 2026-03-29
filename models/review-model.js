const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);


