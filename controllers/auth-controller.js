const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');
const Artist = require('../models/artist-model');
const bcrypt = require('bcryptjs');
const Review = require('../models/review-model');

// --- REGISTRATION LOGIC (CREATE) ---
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, dob } = req.body;

        // 1. Check if passwords match
        if (password !== confirmPassword) {
            return res.render("main/error-page", { error: "Passwords do not match. Please go back and try again." });
        }

        // 2. Basic Password Validation (Minimum 8 characters)
        if (password.length < 8) {
            return res.render("main/error-page", { error: "Password is too weak. It must be at least 8 characters long." });
        }

        // 3. Check if username exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render("main/error-page", { error: "Username already taken. Please choose another." });
        }

        // 4. Hash password and save
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
        res.render("main/error-page", { error: "An Error Occurred During Registration. Please Try Again Later!" })
    }
};

// --- LOGIN LOGIC ---
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {          
            return res.render("main/error-page", { error: "User Not Found. Please Check Your Spelling!" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("main/error-page", { error: "Incorrect Password. Please try again!" })
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.redirect('/auth/home');
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "An Error Occurred During Login. Please Try Again Later!" })
    }
};

// --- HOMEPAGE / DASHBOARD LOGIC ---
exports.showDashboard = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        //* Call Playlist.getUserPlaylists method to populate homepage with playlist data
        const userPlaylists = await Playlist.getUserPlaylists(req.session.username);

        //* Fetch all artists from the database
        const allArtists = await Artist.retrieveAll().populate('artistGenre');

        //* Randomize order of artists using sort()
        const shuffled = allArtists.sort(() => Math.random() - 0.5);

        //* Limit to only 5 artists using slice()
        const randomFive = shuffled.slice(0, 5);

        const userReviews = await Review.find({ userId: req.session.userId }).populate({
            path: 'songId',
            populate: {
                path: 'artistId',
                model: 'Artist'
            }
        });

        res.render("main/home-page", {
            uid: req.session.userId,
            username: req.session.username,
            //* Populate data based on user
            playlists: userPlaylists,
            artists: randomFive, //* Pass only 5 randomized artists
            reviews: userReviews
        });
    } catch (error) {
        console.log(error);
        res.render("main/error-page", { error: "Failed to Load Dashboard Data." })
    }
};

// --- PROFILE LOGIC (READ) ---
exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.redirect('/auth/login');

        // Format Date for HTML
        const formattedDob = user.dob ? user.dob.toISOString().split('T')[0] : '';

        res.render("auth/profile", { user, formattedDob, msg: null });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Loading Profile." })
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

        res.render("auth/profile", { user, formattedDob, msg: "Profile updated successfully!" });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Updating Profile." })
    }
};

// --- PROFILE LOGIC (DELETE) ---
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.session.userId;
        const username = req.session.username;


        await Review.deleteMany({ userId: userId });
        
        // Delete all playlists using our new helper function
        await Playlist.deleteAllUserPlaylists(username);

        // Finally, delete the actual user account
        await User.findByIdAndDelete(userId);
        
        // Clear session data and redirect to welcome page
        req.session.destroy((err) => {
            res.redirect('/'); 
        });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Deleting Profile." })
    }
};

// --- LOGOUT LOGIC ---
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
};