// Dummy Data
exports.showGuestDashboard = (req, res) => {
    // Points to "home-page.ejs" file in /views folder
    res.render("home-page", {
        uid: "guest",
        username: "TestUser", // Displays "Welcome Back TestUser!"
        playlists: [],     // Passes an empty array so the table shows "No playlists yet"
        reviews: []        // Passes an empty array for reviews
    });
}; 