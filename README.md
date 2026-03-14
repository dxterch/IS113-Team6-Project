Mini “Spotify” Playlist Manager (IS113 Team 6)
A personal music management application built with Node.js, Express.js, and EJS. This project demonstrates a complete backend web application featuring user authentication, personalized dashboards, and a full CRUD (Create, Read, Update, Delete) system for managing playlists and song reviews.

🚀 Key Features

    User Authentication & Authorization: A secure system for user registration and login. Access to personal data is restricted via specific User IDs (UIDs) to maintain context without session managers.
    Personalized Dashboard: A dynamic homepage that uses multi-schema retrieval to display a user's playlists and reviews simultaneously.
    Playlist CRUD: Complete functionality to create new playlists with at least 5 data fields (PID, Name, Owner, Date, Description, Songs).
    Song Library & Search: A dedicated management page to browse songs, view album covers, and filter tracks by name using keyword search.
    Review System: Allows users to leave ratings and reviews for songs, linking song data with user interactions.

🛠️ Technical Stack

    Backend: Node.js & Express.js.
    View Engine: EJS (Embedded JavaScript) for dynamic HTML rendering.
    Data Persistence: Asynchronous reading and writing to JSON files using the Node.js fs/promises module (transitioning to MongoDB).
    Architecture: Follows the Model-View-Controller (MVC) pattern for clear separation of concerns.
