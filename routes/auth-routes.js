const express = require("express");
const router = express.Router(); // Create a modular router object

const authController = require("../controllers/auth-controller");

// Display the Registration Page
router.get("/register", (req, res) => {
    // Passes null/empty values so the EJS template doesn't error out
    res.render("registration"); 
});

// Display the Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Placeholder for Homepage
router.get("/home", authController.showGuestDashboard);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;