require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const server = express();

// connecting to mongodb
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to mongodb atlas!");
}).catch((err) => {
  console.error("Failed to connect",err)
});

// Configuring Middleware
server.use(express.urlencoded({ extended: true }));


// Use express.static to serve static files from "public" directory.
server.use("/", express.static(path.join(__dirname, "public")));

// Set up Template Engine
// Set EJS as view engine
server.set('view engine', 'ejs');
server.set("views", path.join(__dirname, "views"));

// session middleware 
server.use(session({
  secret: 'is113_super_secret_key', //secret key for sessionid
  resave:false,
  saveUninitialized: false
}));

// All basic routes
const authRoutes = require("./routes/auth-routes");         // Handles Registration & Login Views
const playlistRoutes = require("./routes/playlist-routes"); // Handles Playlist Management & Details Views
const songRoutes = require("./routes/song-routes");         // Handles Song Library Views
const reviewRoutes = require("./routes/review-routes");     // Handles Song Reviews Views
const artistRoutes = require("./routes/artist-routes");     // Handles Artist Management Views

server.use("/auth", authRoutes);            // Handles Registration & Login Views
server.use("/playlists", playlistRoutes);   // Handles Playlist Management & Details Views
server.use("/songs-page", songRoutes);           // Handles Song Library Views
server.use("/reviews-page", reviewRoutes);       // Handles Song Reviews View
server.use("/artists", artistRoutes);       // Handles Artist Management view

// Start server
const hostname = 'localhost';
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});