const Review = require('../models/review-model');

exports.getSongReviews = async (req, res) => {
    try {
        const { songId } = req.params;

        const reviews = await Review.find({ songId }).sort({ createdAt: -1 });

        const avgRating =
            reviews.length > 0
                ? (
                    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                ).toFixed(1)
                : 0;

        res.render('reviews', {
            songId,
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
            const reviews = await Review.find({ songId }).sort({ createdAt: -1 });

            const avgRating =
                reviews.length > 0
                    ? (
                        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    ).toFixed(1)
                    : 0;

            return res.render('reviews', {
                songId,
                reviews,
                avgRating,
                error: 'Please enter a valid rating and comment.'
            });
        }

        await Review.create({
            songId,
            rating,
            comment
        });

        res.redirect(`/reviews-page/song/${songId}`);
    } catch (error) {
        res.status(500).send('Error creating review');
    }
};