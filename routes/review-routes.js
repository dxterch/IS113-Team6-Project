const express = require("express");
const router = express.Router(); //create a router to store routes
const reviewController = require("../controllers/review-controller"); // import CRUD functions from controller 
const authMiddleware = require("../middlewares/auth-middleware"); // import middleware 

// Read
router.get("/song/:songId", authMiddleware.requireLogin, reviewController.getSongReviews);

// Create
router.post("/song/:songId", authMiddleware.requireLogin, reviewController.createSongReview);

// Update
router.get('/edit/:reviewId', authMiddleware.requireLogin, reviewController.showEditReview);
router.post('/edit/:reviewId', authMiddleware.requireLogin, reviewController.updateReview);

// Delete
router.post('/delete', authMiddleware.requireLogin, reviewController.deleteReviews);

module.exports = router; // export so that other files can use it 
