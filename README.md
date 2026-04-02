
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
IS113-Team-6-Project
├─ .gitignore
├─ README.md
├─ config.env
├─ controllers
│  ├─ artist-controller.js
│  ├─ auth-controller.js
│  ├─ genre-controller.js
│  ├─ playlist-controller.js
│  ├─ review-controller.js
│  └─ song-controller.js
├─ data
│  ├─ SpotifyDB.artists.json
│  ├─ SpotifyDB.genres.json
│  ├─ SpotifyDB.reviews.json
│  ├─ SpotifyDB.songs.json
│  ├─ SpotifyDB.users.json
│  ├─ review-data.json
│  └─ song-data.json
├─ details.txt
├─ middlewares
│  └─ auth-middleware.js
├─ models
│  ├─ artist-model.js
│  ├─ genre-model.js
│  ├─ playlist-model.js
│  ├─ review-model.js
│  ├─ song-model.js
│  └─ user-model.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ images
│  │  ├─ artists
│  │  │  ├─ 1775132664392-taylorswift.jpg
│  │  │  ├─ 1775132713201-kendricklamar.jpg
│  │  │  ├─ 1775132736440-theweeknd.jpg
│  │  │  ├─ 1775132758128-edsheeran.jpg
│  │  │  ├─ 1775132778712-billieeilish.jpg
│  │  │  ├─ 1775132809047-drake.jpg
│  │  │  ├─ 1775132833894-adele.jpg
│  │  │  ├─ 1775132856556-brunomars.jpg
│  │  │  ├─ 1775132895738-dualipa.jpg
│  │  │  ├─ 1775132919888-badbunny.jpg
│  │  │  ├─ 1775133801005-markronson.jpg
│  │  │  ├─ 1775133883391-taylorswift.jpg
│  │  │  ├─ 1775134387296-taylorswift.jpg
│  │  │  ├─ 1775134416218-theweeknd.jpg
│  │  │  ├─ 1775134428496-edsheeran.jpg
│  │  │  ├─ 1775134711483-kendricklamar.jpg
│  │  │  ├─ default_artist.png
│  │  │  └─ kendrick.jpg
│  │  ├─ genres
│  │  │  ├─ alternative.jpg
│  │  │  ├─ country.png
│  │  │  ├─ default_genre.avif
│  │  │  ├─ electronic.png
│  │  │  ├─ hiphop.jpg
│  │  │  ├─ indie.jpg
│  │  │  ├─ jazz.png
│  │  │  ├─ latin.png
│  │  │  ├─ pop.png
│  │  │  ├─ r&b.png
│  │  │  ├─ rb.jpg
│  │  │  └─ rock.png
│  │  └─ spotify_logo.png
│  └─ index.html
├─ routes
│  ├─ artist-routes.js
│  ├─ auth-routes.js
│  ├─ genre-routes.js
│  ├─ playlist-routes.js
│  ├─ review-routes.js
│  └─ song-routes.js
├─ server.js
├─ utils
│  └─ constants.js
└─ views
   ├─ artists
   │  ├─ artist-details.ejs
   │  ├─ artist-following.ejs
   │  ├─ browse-artists.ejs
   │  ├─ create-artist.ejs
   │  ├─ manage-artists.ejs
   │  └─ update-artist.ejs
   ├─ auth
   │  ├─ login.ejs
   │  ├─ profile.ejs
   │  └─ registration.ejs
   ├─ genres
   │  ├─ browse-genres.ejs
   │  ├─ create-genre.ejs
   │  ├─ genre-details.ejs
   │  ├─ manage-genres.ejs
   │  └─ update-genre.ejs
   ├─ main
   │  ├─ error-page.ejs
   │  └─ home-page.ejs
   ├─ partials
   │  ├─ footer.ejs
   │  └─ nav.ejs
   ├─ playlists
   │  ├─ create-playlist.ejs
   │  ├─ manage-playlist.ejs
   │  └─ view-playlist.ejs
   ├─ reviews
   │  ├─ edit-review.ejs
   │  └─ manage-reviews.ejs
   └─ songs
      ├─ browse-songs.ejs
      ├─ create-songs.ejs
      └─ manage-songs.ejs
```
