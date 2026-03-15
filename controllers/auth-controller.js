const User = require('../models/user'); // Import the User model you created
const bcrypt = require('bcryptjs'); // Import the password hasher

// --- REGISTRATION LOGIC ---
exports.registerUser = async (req, res) => {
    try {
        // 1. Extract the data submitted from the HTML form
        const { username, email, password, confirmPassword, dob } = req.body;

        // 2. Basic Error Handling: Check if passwords match
        if (password !== confirmPassword) {
            return res.send("Passwords do not match. Please go back and try again.");
        }

        // 3. Check if the user already exists in the database
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.send("Username already taken. Please choose another.");
        }

        // 4. Security: Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create and save the new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            dob: dob
        });
        await newUser.save();

        // 6. Success! Redirect them to the login page
        res.redirect('/auth/login');

    } catch (error) {
        console.error(error);
        res.send("An error occurred during registration.");
    }
};

// --- LOGIN LOGIC ---
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find the user by username
        const user = await User.findOne({ username: username });
        
        // 2. Error Handling: User not found
        if (!user) {
            // Matches the error message from the project sketch exactly
            return res.send("user not found, check spelling OR register here"); 
        }

        // 3. Security: Compare the typed password with the hashed database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Incorrect password.");
        }

        // 4. Authorization: Save the user's ID to the session to keep them logged in
        req.session.userId = user._id;
        req.session.username = user.username;

        // 5. Success! Redirect to the personalized homepage
        res.redirect('/auth/home');

    } catch (error) {
        console.error(error);
        res.send("An error occurred during login.");
    }
};

// --- HOMEPAGE / DASHBOARD LOGIC ---
exports.showGuestDashboard = async (req, res) => {
    // 1. Protect this route: If they are not logged in, kick them back to login
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    // 2. Render the homepage with their actual session data
    res.render("home-page", {
        uid: req.session.userId,
        username: req.session.username,
        playlists: [], // populate later with playlist crud
        reviews: []    // populate later with reviews crud 
    });
};
