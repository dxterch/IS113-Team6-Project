const Review = require('../models/review-model');
const Songs = require('../models/song-model');

exports.getSongReviews = async (req, res) => {
    try {
        const { songId } = req.params;

        const song = await Songs.findById(songId);
        const reviews = await Review.find({ songId }).populate('userId', 'username').sort({ createdAt: -1 });

        const avgRating =
            reviews.length > 0
                ? (
                    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                ).toFixed(1)
                : 0;

        await Songs.updateAvgRating(songId, avgRating);

        res.render('reviews', {
            songId,
            songName: song ? song.songName : 'Unknown Song',
            reviews,
            avgRating,
            error: null,
            uid: req.session.userId
        });
    } catch (error) {
        res.status(500).send('Error loading reviews');
    }
};

exports.createSongReview = async (req, res) => {
    try {
        const { songId } = req.params;
        const rating = Number(req.body.rating);
        const comment = req.body.comment?.trim();

        if (!rating || rating < 1 || rating > 5 || !comment) {
            const song = await Songs.findById(songId);
            const reviews = await Review.find({ songId }).populate('userId', 'username').sort({ createdAt: -1 });

            const avgRating =
                reviews.length > 0
                    ? (
                        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    ).toFixed(1)
                    : 0;

            return res.render('reviews', {
                songId,
                songName: song ? song.songName : 'Unknown Song',
                reviews,
                avgRating,
                error: 'Please enter a valid rating and comment.',
                uid: req.session.userId
            });
        }

        await Review.create({
            songId,
            rating,
            comment,
            userId: req.session.userId
        });

        res.redirect(`/reviews-page/song/${songId}`);
    } catch (error) {
        res.status(500).send('Error creating review');
    }
};
exports.deleteReviews = async (req, res) => {
    try {
        let { selectedReviews } = req.body;

        if (!selectedReviews) {
            return res.redirect('/auth/home');
        }

        if (!Array.isArray(selectedReviews)) {
            selectedReviews = [selectedReviews];
        }

        await Review.deleteMany({
            _id: { $in: selectedReviews },
            userId: req.session.userId
        });

        res.redirect('/auth/home');
    } catch (error) {
        res.status(500).send('Error deleting reviews');
    }
};
exports.showEditReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findOne({
            _id: reviewId,
            userId: req.session.userId
        });

        if (!review) {
            return res.status(404).send('Review not found');
        }

        res.render('edit-review', { review });
    } catch (error) {
        res.status(500).send('Error loading edit review page');
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const rating = Number(req.body.rating);
        const comment = req.body.comment?.trim();

        if (!rating || rating < 1 || rating > 5 || !comment) {
            return res.send('Please enter a valid rating and comment.');
        }

        const review = await Review.findOneAndUpdate(
            { _id: reviewId, userId: req.session.userId },
            { rating, comment },
            { returnDocument: 'after' }
        );

        if (!review) {
            return res.status(404).send('Review not found');
        }

        const reviews = await Review.find({ songId: review.songId });
        const avgRating =
            reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
                : 0;

        await Songs.updateAvgRating(review.songId, avgRating);

        res.redirect(`/reviews-page/song/${review.songId}`);
    } catch (error) {
        res.status(500).send('Error updating review');
    }
};