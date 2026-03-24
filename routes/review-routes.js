const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review-controller");

router.get("/song/:songId", reviewController.getSongReviews);
router.post("/song/:songId", reviewController.createSongReview);

module.exports = router;