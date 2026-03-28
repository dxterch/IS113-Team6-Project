const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');
const Artist = require('../models/artist-model');
const bcrypt = require('bcryptjs');

// --- REGISTRATION LOGIC (CREATE) ---
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, dob } = req.body;

        if (password !== confirmPassword) {
            return res.send("Passwords do not match. Please go back and try again.");
        }

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.send("Username already taken. Please choose another.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            dob: dob
        });
        await newUser.save();

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
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.send("user not found, check spelling OR register here");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Incorrect password.");
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.redirect('/auth/home');
    } catch (error) {
        console.error(error);
        res.send("An error occurred during login.");
    }
};

// --- HOMEPAGE / DASHBOARD LOGIC ---
exports.showGuestDashboard = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        //* FIX: Call Playlist.getUserPlaylists method to populate homepage with playlist data
        const userPlaylists = await Playlist.getUserPlaylists(req.session.username);

        //* Fetch all artists from the database
        const allArtists = await Artist.retrieveAll().populate('artistGenre');

        //* Randomize order of artists using sort()
        const shuffled = allArtists.sort(() => Math.random() - 0.5);

        //* Limit to only 5 artists using slice()
        const randomFive = shuffled.slice(0, 5);

        res.render("home-page", {
            uid: req.session.userId,
            username: req.session.username,
            //* Populate data based on user
            playlists: userPlaylists,
            artists: randomFive, //* Pass only 5 randomized artists
            reviews: []
        });
    } catch (error) {
        console.log(error);
        res.render("error-page", { error: "Failed to Load Dashboard Data." })
    }
};

// --- PROFILE LOGIC (READ) ---
exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.redirect('/auth/login');

        // Format Date for HTML <input type="date">
        const formattedDob = user.dob ? user.dob.toISOString().split('T')[0] : '';

        res.render("profile", { user, formattedDob, msg: null });
    } catch (error) {
        console.error(error);
        res.send("Error loading profile.");
    }
};

// --- PROFILE LOGIC (UPDATE) ---
exports.updateProfile = async (req, res) => {
    try {
        const { email, dob } = req.body;

        // Update user data
        await User.findByIdAndUpdate(req.session.userId, { email, dob });

        // Fetch updated user to render view properly
        const user = await User.findById(req.session.userId);
        const formattedDob = user.dob ? user.dob.toISOString().split('T')[0] : '';

        res.render("profile", { user, formattedDob, msg: "Profile updated successfully!" });
    } catch (error) {
        console.error(error);
        res.send("Error updating profile.");
    }
};

// --- PROFILE LOGIC (DELETE) ---
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.userId);
        req.session.destroy(); // Clear session data
        res.redirect('/'); // Send back to welcome page
    } catch (error) {
        console.error(error);
        res.send("Error deleting account.");
    }
};

// --- LOGOUT LOGIC ---
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
};