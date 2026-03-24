const mongoose = require("mongoose");
const playlistSchema = new mongoose.Schema(
{
    uid: {
        type: String,
        required: true
    },
    pname: {
        type: String,
        required: true,
        unique: true
    },
    caption:{
        type: String
    },
    dateCreated:{
        type: Date.now
    },
    songs: [
        {type: String}
    ]
}
)


const Playlist = mongoose.model("Playlist", playlistSchema, "playlists")
exports.createPlaylist = (playlists) => {
    return Playlist.create(playlists);
}
