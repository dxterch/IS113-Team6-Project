
# Mini Spotify Project

A full-stack web application designed to be a personal playlist manager, built with Express.js, MongoDB, and EJS templates using the MVC architecture, by IS113 G10 Team 06.

## Features
- **User Authenticaiton and Authorization**: Secure Registration and login functionalities using encrypted passwords. The system has 2 distinct roles, reguler users and administrative users.

- **Playlist Management**: Users can create new playlists, insert their favorite songs. Playlists can also be modified or completely deleted.

- **Songs Search**: Browse a library of artists and genres, or use the dedicated search functionality to find specific songs.

- **Song Reviews and Ratings**: Users can leave a 1 to 5 score rating and written comments on individual songs, which are dynamically aggregated to show an average rating per song.

- **Admin Controls**: Administrators have access to manage the database. They can create, read, update, and delete artist profiles, songs, and genres.

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
IS113-Team6-Project
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

# Installation
1. **Extract Folder to a Valid Folder Path**
```
    Ensure that the folders are 
```

2. **Install Dependencies**
```
    npm install
```

3. **Set up MongoDB**
```
    Update the MONGO_URI in config.env file with the given connection string.
```

4. **Start the Application**
```
    npm start
```

5. **Open your browser**
```
http://localhost:8000
```

## Usage

### For Users

1. **Authentication**: Register a new account or log in to access personalized features.
2. **Browse Library**: Navigate to the Genres, Artists, or Songs pages to discover music.
3. **Playlists**: Create and manage custom playlists.
4. **Interact**: Leave reviews on your favorite songs and follow artists.

### For Developers

* **Models**: Define database schemas (Artists, Genres, Playlists, etc.) in the `models/` directory.
* **Controllers**: Handle business logic and database operations in the `controllers/` directory.
* **Routes**: Define web and API endpoints in the `routes/` directory.
* **Views**: Create the frontend UI using EJS templates grouped by feature in the `views/` directory.
* **Middleware**: Handle route protection and user authentication in the `middlewares/` directory.

## API Endpoints & Routes

### Authentication & Users (`/auth`)
* `GET /auth/register` - Load the user registration page (Unprotected)
* `POST /auth/register` - Submit new user registration data (Unprotected)
* `GET /auth/login` - Load the user login page (Unprotected)
* `POST /auth/login` - Authenticate and log in a user (Unprotected)
* `GET /auth/home` - View the user dashboard/home page (Requires Login)
* `GET /auth/profile` - View the current user's profile (Requires Login)
* `POST /auth/profile/update` - Update user profile details (Requires Login)
* `POST /auth/profile/update-password` - Update user password (Requires Login)
* `POST /auth/profile/delete` - Delete the user's account (Requires Login)
* `GET /auth/logout` - Log the current user out of the session (Requires Login)

### Artists (`/artists`)
* `GET /artists/browse` - View all available artists (Requires Login)
* `POST /artists/browse` - Search for specific artists (Requires Login)
* `GET /artists/details` - View a specific artist's profile and their songs (Requires Login)
* `GET /artists/following` - View the logged-in user's followed artists (Requires Login)
* `POST /artists/follow/:id` - Toggle following/unfollowing a specific artist (Requires Login)
* `GET /artists/manage` - Admin dashboard to view and manage artists (Requires Admin)
* `POST /artists/manage` - Search for artists within the management dashboard (Requires Admin)
* `GET /artists/create` - Load the form to add a new artist (Requires Admin)
* `POST /artists/create` - Submit the form to create a new artist (Requires Admin)
* `GET /artists/update` - Load the edit form for a specific artist (Requires Admin)
* `POST /artists/update` - Submit updated artist data (Requires Admin)
* `POST /artists/delete` - Delete a specific artist (Requires Admin)

### Genres (`/genres`)
* `GET /genres/browse` - View all available genres (Requires Login)
* `GET /genres/details` - View specific genre details and associated artists/songs (Requires Login)
* `GET /genres/manage` - Admin dashboard to view and manage all genres (Requires Admin)
* `GET /genres/create` - Load the form to create a new genre (Requires Admin)
* `POST /genres/create` - Submit the form to create a new genre (Requires Admin)
* `POST /genres/edit-form` - Load the edit form for a specific genre (Requires Admin)
* `POST /genres/update` - Submit updated genre data (Requires Admin)
* `POST /genres/delete` - Delete a specific genre (Requires Admin)

### Songs (`/songs`)
* `GET /songs/browse` - View and discover all available songs (Requires Login)
* `POST /songs/browse` - Search for specific songs (Requires Login)
* `GET /songs/manage-songs` - Admin dashboard to view and manage all song entries (Requires Admin)
* `GET /songs/create` - Load the form to add a new song to the database (Requires Admin)
* `POST /songs/upload` - Submit the form data to create a new song (Requires Admin)
* `POST /songs/update` - Load the edit form for a specific song (Requires Admin)
* `POST /songs/changed` - Submit the updated song data to the database (Requires Admin)
* `POST /songs/delete` - Delete a specific song from the database (Requires Admin)

### Playlists (`/playlists`)
* `GET /playlists/manage-list` - View all playlists owned by the logged-in user (Requires Login)
* `GET /playlists/view` - View the contents and songs of a specific playlist (Requires Login)
* `GET /playlists/new-playlist` - Load the form to create a new custom playlist (Requires Login)
* `GET /playlists/edit-playlist` - Load the page/form to edit an existing playlist (Requires Login)
* `POST /playlists/edit-form` - Handle the request to bring up edit options (Requires Login)
* `POST /playlists/edit` - Save changes made to a playlist (Requires Login)
* `POST /playlists/delete` - Delete a specific playlist (Requires Login)

### Reviews (`/reviews`)
* `GET /reviews/song/:songId` - View all reviews for a specific song (Requires Login)
* `POST /reviews/song/:songId` - Submit a new review and rating for a specific song (Requires Login)
* `GET /reviews/edit/:reviewId` - Load the form to edit an existing review (Requires Login)
* `POST /reviews/edit/:reviewId` - Submit the updated review data (Requires Login)
* `POST /reviews/delete` - Delete a specific review (Requires Login)

## Database Schema

### User
* `_id`: ObjectId
* `username`: String
* `email`: String
* `password`: String
* `dob`: Date
* `dateJoined`: Date
* `role`: String
* `following`: ObjectId

### Artist
* `_id`: ObjectId
* `artistName`: String
* `artistGenre`: [ObjectId]
* `artistBio`: String
* `artistCountry`: String
* `artistGender`: String
* `artistImage`: String
* `artistDateAdded`: Date
* `artistFollowers`: ObjectId

### Genre
* `_id`: ObjectId
* `genreName`: String
* `description`: String
* `originYear`: Number
* `coverImage`: String
* `regionOrigin`: String
* `notableStyle`: String

### Song
* `_id`: ObjectId
* `songName`: String
* `artistId`: ObjectId
* `avgRating`: Number
* `albumCover`: String
* `genreId`: ObjectId

### Playlist
* `_id`: ObjectId
* `pname`: String
* `username`: String
* `caption`: String
* `songs`: [ObjectId]
* `userId`: ObjectId

### Review
* `_id`: ObjectId
* `songId`: ObjectId
* `rating`: Number
* `comment`: String
* `userId`: ObjectId
* `createdAt`: Date
* `updatedAt`: Date

# AI Usage
AI (LLM) was utilized for tasks to improve the maintainability and readibility of codes like:
- Code Documentation: Ideas on how to document the codes with comments
- Code Tidying and Refactoring Hints: Suggestions for layouts of Mongoose Schemas and tidying the structure of EJS templates for better readability.
- Logic Explanation: Using AI to explain the complex debugging hints, Mongoose-specific behaviors (like the ObjectId referencing)
- Utility Logic Documentation and Refinement: Used AI to help structure and ways to comment a utility function such as for processing Base64 image data.
  - Regex Explanation: Understand and refine the Regular Expression used to strip metadata from Data URLs.
  - Data Conversion Best Practices: Confirm correct syntax using Buffer.from() to translate Base64 strings into binary data for file system.
  - Error Handling Boilerplate: Generating if statements to check for invalid string formats before writing to a file.
- Filename Formatting Logic: For suggestion of using .replace() to ensure filenames are URL-friendly (remove space and force lowercase).

Summary: AI was used to generate boilerplate code snippets for utility functions such as the Base64 processing and to provide explanations for coding errors during the debugging of Mongoose ObjectId references, and produce test data to populate the database. All core implementation tasks, such as the backend endpoint logic and the relational database design, were developed independently.
