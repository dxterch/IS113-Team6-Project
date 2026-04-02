const mongoose = require("mongoose");
const playlistSchema = new mongoose.Schema(
{
    pname: {
        type: String,
        required: [true, "A playlist must have a name"],
        unique: [true, "Playlist Name must be unique"],
    },
    username: {
        type: String, 
        required: true
    },
    caption:{
        type: String
    },
    dateCreated:{
        type: Date, 
        default: Date.now

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


//CRUD
//create
exports.createPlaylist = function (playlistData) {
    return Playlist.create(playlistData);
}
//read
exports.getPlaylistById= function(id){
    return Playlist.findOne({_id: id})
}

// Changed to Username
exports.getUserPlaylists = function(username){
    return Playlist.find({ username: username }) 
}

//update
exports.updatePlaylist = function (id, updateData) {
    return Playlist.updateOne({_id: id}, updateData)
}
//delete
exports.deletePlaylist = function (id) {
    return Playlist.deleteOne({_id: id})
}
//get playlist names --> for checks
exports.getPlaylistByName = function(pname){
    return Playlist.findOne({pname});
}

exports.deleteAllUserPlaylists = (username) => {
    // If your internal Mongoose model variable is named something else, change 'Playlist' here to match it
    return Playlist.deleteMany({ username: username });
};

