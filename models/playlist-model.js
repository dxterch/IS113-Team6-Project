const mongoose = require("mongoose");
const playlistSchema = new mongoose.Schema(
{
    uid: {
        type: String,
        required: true
    },
    pname: {
        type: String,
        required: [true, "A playlist must have a name"],
        unique: [true, "Playlist Name must be unique"],
    },
    caption:{
        type: String
    },
    dateCreated:{
        type: Date

    },
    songs: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
        }
    ]
}
)


const Playlist = mongoose.model("Playlist", playlistSchema, "playlists")
//                               schema name,,
exports.createPlaylist = (playlists) => {
    return Playlist.create(playlists);
}
