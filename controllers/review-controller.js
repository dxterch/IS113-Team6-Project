const Review = require('../models/review-model');
const Songs = require('../models/song-model');

exports.getSongReviews = async (req, res) => {
    try {
        const songId = req.params.songId; // taken songid from URL

        const song = await Songs.findById(songId);  // return one song
        const reviews = await Review.getSongReviews(songId);

        const avgRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

        await Songs.updateOne({ _id: songId }, { avgRating: Number(avgRating) });

        res.render('reviews/manage-reviews', {
            songId,
            songName: song ? song.songName : 'Unknown Song',
            reviews,
            avgRating,
            error: null,
            uid: req.session.userId
        });
    } catch (error) {
        res.render("main/error-page", { error: "Error loading reviews" });
    }
};

exports.createSongReview = async (req, res) => {
    try {
        const songId = req.params.songId;
        const rating = Number(req.body.rating);
        const comment = req.body.comment ? req.body.comment.trim() : '';

        if (!rating || rating < 1 || rating > 5 || !comment) {
            const song = await Songs.findById(songId);
            const reviews = await Review.getSongReviews(songId);

            const avgRating = reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;

            return res.render('reviews/manage-reviews', {
                songId,
                songName: song ? song.songName : 'Unknown Song',
                reviews,
                avgRating,
                error: 'Please enter a valid comment.',
                uid: req.session.userId
            });
        }

        await Review.createReview({
            songId,
            rating,
            comment,
            userId: req.session.userId
        });

        res.redirect(`/reviews-page/song/${songId}`);
    } catch (error) {
        res.render("main/error-page", { error: "Error creating review" });
    }
};

exports.deleteReviews = async (req, res) => {
    try {
        let selectedReviews = req.body.selectedReviews;

        if (!selectedReviews) {
            return res.redirect('/auth/home');
        }

        if (!Array.isArray(selectedReviews)) {
            selectedReviews = [selectedReviews];
        }

        const reviewsToDelete = await Review.getReviewsByIdsAndUser(
            selectedReviews,
            req.session.userId
        );

        const songIds = [];
        for (const review of reviewsToDelete) {
            const songId = review.songId.toString();

            if (!songIds.includes(songId)) {
                songIds.push(songId);
            }
        }

        await Review.deleteUserReviews(selectedReviews, req.session.userId);

        // Recalculate average after deletion
        for (const songId of songIds) {
            const reviews = await Review.getReviewsBySongId(songId);
            const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

            await Songs.updateOne({ _id: songId }, { avgRating: Number(avgRating) });
        }

        res.redirect('/auth/home');
    } catch (error) {
        res.render("main/error-page", { error: "Error deleting review" });
    }
};

exports.showEditReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.getUserReview(reviewId, req.session.userId);

        if (!review) {
            return res.status(404).send('Review not found');
        }

        res.render('reviews/edit-review', { review });
    } catch (error) {
        res.render("main/error-page", { error: "Error editing review" });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const rating = Number(req.body.rating);
        const comment = req.body.comment ? req.body.comment.trim() : '';

        if (!rating || rating < 1 || rating > 5 || !comment) {
            return res.render("main/error-page", { error: "Please enter a valid comment." });
        }

        const review = await Review.updateUserReview(
            reviewId,
            req.session.userId,
            { rating, comment }
        );

        if (!review) {
            return res.render("main/error-page", { error: "Error loading review" });
        }

        const reviews = await Review.getReviewsBySongId(review.songId);
        const avgRating = reviews.length > 0  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

        await Songs.updateOne({ _id: review.songId }, { avgRating: Number(avgRating) });

        res.redirect(`/reviews-page/song/${review.songId}`);
    } catch (error) {
        res.render("main/error-page", { error: "Error updating review" });
    }
};