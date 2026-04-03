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

const Review = mongoose.model('Review', reviewSchema, 'reviews');

Review.getSongReviews = (songId) => {
    return Review.find({ songId }) // return many reviews for one song
        .populate('userId', 'username') // replace userId to username
        .sort({ createdAt: -1 }); // sort in descending order
};

Review.createReview = (reviewData) => {
    return Review.create(reviewData);
};

Review.getUserReview = (reviewId, userId) => {
    return Review.findOne({ _id: reviewId, userId });
};

Review.getReviewsBySongId = (songId) => {
    return Review.find({ songId });
};

Review.getReviewsByIdsAndUser = (selectedReviews, userId) => {
    return Review.find({
        _id: { $in: selectedReviews },
        userId
    });
};

Review.updateUserReview = (reviewId, userId, updateData) => {
    return Review.findOneAndUpdate(
        { _id: reviewId, userId },
        updateData,
        { returnDocument: 'after' }
    );
};

Review.deleteUserReviews = (selectedReviews, userId) => { // /find reviews whose _id is one of the selected review IDs
    return Review.deleteMany({
        _id: { $in: selectedReviews },
        userId
    });
};

module.exports = Review;