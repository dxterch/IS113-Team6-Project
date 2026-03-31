
# Mini Spotify Project

A full-stack web application designed to be a personal playlist manager, built with Express.js, MongoDB, and EJS templates using the MVC architecture.

## Features
- **User Authenticaiton and Authorization**: Secure Registration and login functionalities using encrypted passwords. The system has 2 distinct roles, reguler users and administrative users.

- **Playlist Management**: Users can create new playlists, insert their favorite songs. Playlists can also be modified or completely deleted.

- **Songs Search**: Browse a library of artists and genres, or use the dedicated search functionality to find specific songs.

- **Song Reviews and Ratings**: Users can leave a 1 to 5 score rating and written comments on individual songs, which are dynamically aggregated to show an average rating per song.

- **Admin Controls**: Administrators have access to manage the database. They can create, update, and delete artist profiles and music genres.

- **Personalized Dashboard**: A homepage that greets the user, showcases their own playlists, and displays a randomized selection of featured artists.




## Tech Stack

**Frontend:** HTML, CSS, and EJS (Embedded JavaScript) templating for dynamic view rendering

**Backend:** Node.js utilizing the Express.js framework for routing and middleware management, with MVC architecture.

**Database:** MongoDB data stored and queried via the Mongoose ODM

**Security**: bcryptjs for secure password hashing and express-session for maintaing state acress pages.


## Usage/Examples

- **As a User**: Register an account to access the homepage, create custom playlists, update profile (like email and DOB), and post reviews on various songs.

- **As an Admin**: Log in with an admin-level account to bypass the requireAdmin middleware. This unlocks the "Manage Artists", "Manage Songs", "Manage Genres" navigation tabs, granting full CRUD (Create, Read, Update, Delete) control over the applications underlying data.


## Project Structure
```
IS113-Team6-Project/
├── .gitignore
├── controllers/
│   ├── artist-controller.js
│   ├── auth-controller.js
│   ├── genre-controller.js
│   ├── playlist-controller.js
│   ├── review-controller.js
│   └── song-controller.js
├── data/
│   ├── artist-data.json
│   ├── auth-data.json
│   ├── countries-data.json
│   ├── genre-data.json
│   ├── playlist-data.json
│   ├── review-data.json
│   └── song-data.json
├── details.txt
├── middlewares/
│   └── auth-middleware.js
├── models/
│   ├── artist-model.js
│   ├── genre-model.js
│   ├── photo-model.js
│   ├── playlist-model.js
│   ├── review-model.js
│   ├── song-model.js
│   └── user-model.js
├── package-lock.json
├── package.json
├── public/
│   ├── images/
│   │   ├── artists/
│   │   │   ├── Billie Eilish.jpg
│   │   │   ├── default_artist.png
│   │   │   ├── Dexter.jpg
│   │   │   ├── Dua Lipa.jpg
│   │   │   ├── Kanye West.jpg
│   │   │   ├── Post Malone.jpg
│   │   │   ├── The Weeknd.jpg
│   │   │   └── Yuno Miles.jpg
│   │   ├── bad_guy.jpg
│   │   ├── blinding_lights.png
│   │   ├── circles.jpg
│   │   ├── download.jpg
│   │   ├── gods_plan.jpg
│   │   ├── hills.png
│   │   ├── levitating.jpg
│   │   ├── noir.jpg
│   │   ├── returnhome.jpg
│   │   ├── runaway.jpg
│   │   ├── spotify_logo.png
│   │   ├── starboy.jpg
│   │   └── vultures.jpg
│   └── index.html
├── README.md
├── routes/
│   ├── artist-routes.js
│   ├── auth-routes.js
│   ├── genre-routes.js
│   ├── playlist-routes.js
│   ├── review-routes.js
│   └── song-routes.js
├── server.js
└── views/
    ├── artist-details.ejs
    ├── browse-artists.ejs
    ├── browse-genres.ejs
    ├── browse-songs.ejs
    ├── create-artist.ejs
    ├── create-genre.ejs
    ├── create-manage-playlist.ejs
    ├── create-songs.ejs
    ├── error-page.ejs
    ├── home-page.ejs
    ├── login.ejs
    ├── manage-artists.ejs
    ├── manage-genres.ejs
    ├── manage-playlist.ejs
    ├── manage-songs.ejs
    ├── partials/
    │   ├── footer.ejs
    │   └── nav.ejs
    ├── profile.ejs
    ├── registration.ejs
    ├── reviews.ejs
    ├── update-artist.ejs
    └── update-genre.ejs
