const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');
const Artist = require('../models/artist-model');
const bcrypt = require('bcryptjs');
const Review = require('../models/review-model');

//  User Registration 
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, dob } = req.body;

        // Ensure the password and confirmation match
        if (password !== confirmPassword) {
            return res.render("main/error-page", { error: "Passwords do not match. Please go back and try again." });
        }

        // Enforce a minimum password length of 8 characters
        if (password.length < 8) {
            return res.render("main/error-page", { error: "Password is too weak. It must be at least 8 characters long." });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.render("main/error-page", { error: "Username already taken. Please choose another." });
        }

        // Hash the password securely and save the new user
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

//  User Login 
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        // Verify the user exists
        if (!user) {          
            return res.render("main/error-page", { error: "User Not Found. Please Check Your Spelling!" })
        }

        // Verify the provided password against the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("main/error-page", { error: "Incorrect Password. Please try again!" })
        }

        // Set up the session variables
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.redirect('/auth/home');
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "An Error Occurred During Login. Please Try Again Later!" })
    }
};

//  Dashboard 
exports.showDashboard = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        // Fetch the user's playlists to display on the dashboard
        const userPlaylists = await Playlist.getUserPlaylists(req.session.username);

        // Retrieve all artists and their associated genres
        const allArtists = await Artist.retrieveAll().populate('artistGenre');

        // Randomly shuffle the artist array
        const shuffled = allArtists.sort(() => Math.random() - 0.5);

        // Pick 5 random artists to feature on the homepage
        const randomFive = shuffled.slice(0, 5);

        // Get reviews created by the current user, pulling in the related song and artist data
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
            playlists: userPlaylists,
            artists: randomFive,
            reviews: userReviews
        });
    } catch (error) {
        console.log(error);
        res.render("main/error-page", { error: "Failed to Load Dashboard Data." })
    }
};

//  View Profile 
exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.redirect('/auth/login');

        // Format the date of birth so it displays correctly in the HTML date input
        const formattedDob = user.dob ? user.dob.toISOString().split('T')[0] : '';

        res.render("auth/profile", { user, formattedDob, msg: null });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Loading Profile." })
    }
};

//  Update Profile Info 
exports.updateProfile = async (req, res) => {
    try {
        const { email, dob } = req.body;

        // Apply the updates to the user's document
        await User.findByIdAndUpdate(req.session.userId, { email, dob });

        // Pull the fresh user data so the view renders the updated info
        const user = await User.findById(req.session.userId);
        const formattedDob = user.dob ? user.dob.toISOString().split('T')[0] : '';

        res.render("auth/profile", { user, formattedDob, msg: "Profile updated successfully!" });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Updating Profile." })
    }
};

//  Update Password 
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.render("main/error-page", { error: "User not found." });
        }

        // Ensure the user knows their current password before allowing a change
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.render("main/error-page", { error: "Incorrect current password. Please try again." });
        }

        // Verify the new password entries match
        if (newPassword !== confirmNewPassword) {
            return res.render("main/error-page", { error: "New passwords do not match." });
        }

        // Enforce the same minimum length requirement as registration
        if (newPassword.length < 8) {
            return res.render("main/error-page", { error: "New password is too weak. It must be at least 8 characters long." });
        }

        // Generate a new hash and update the user record
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        // Re-format the date so the profile view doesn't break
        const formattedDob = user.dob ? user.dob.toISOString().split('T')[0] : '';

        res.render("auth/profile", { user, formattedDob, msg: "Password updated successfully!" });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Updating Password." });
    }
};

//  Delete Account 
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.session.userId;
        const username = req.session.username;

        // Clean up the user's reviews
        await Review.deleteMany({ userId: userId });
        
        // Clean up the user's playlists
        await Playlist.deleteAllUserPlaylists(username);

        // Finally, remove the user document itself
        await User.findByIdAndDelete(userId);
        
        // Destroy the session and send them back to the landing page
        req.session.destroy((err) => {
            res.redirect('/'); 
        });
    } catch (error) {
        console.error(error);
        res.render("main/error-page", { error: "Error Deleting Profile." })
    }
};

//  Logout 
exports.logoutUser = (req, res) => {
    // End the active session and redirect to the landing page
    req.session.destroy((err) => {
        res.redirect('/');
    });
};