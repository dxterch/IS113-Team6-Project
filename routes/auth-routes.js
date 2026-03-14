const express = require("express");
const router = express.Router(); // Create a modular router object [1]

// Display the Registration Page
router.get("/register", (req, res) => {
    // Passes null/empty values so the EJS template doesn't error out
    res.render("registration"); 
});

// Display the Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/home", authController.showDashboard);

module.exports = router;