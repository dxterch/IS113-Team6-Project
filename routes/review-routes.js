const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/song/:songId", authMiddleware.requireLogin, reviewController.getSongReviews);
router.post("/song/:songId", authMiddleware.requireLogin, reviewController.createSongReview);
router.post('/delete', reviewController.deleteReviews);
module.exports = router;