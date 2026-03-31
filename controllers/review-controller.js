const Review = require('../models/review-model');
const Songs = require('../models/song-model');

exports.getSongReviews = async (req, res) => {
    try {
        const { songId } = req.params;

        const song = await Songs.findById(songId);
        const reviews = await Review.find({ songId }).sort({ createdAt: -1 });

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
            error: null
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
            const reviews = await Review.find({ songId }).sort({ createdAt: -1 });

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
                error: 'Please enter a valid rating and comment.'
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