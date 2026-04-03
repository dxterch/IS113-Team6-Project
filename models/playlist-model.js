const mongoose = require("mongoose");
const playlistSchema = new mongoose.Schema(
{
    pname: {
        type: String,
        required: [true, "A playlist must have a name"],
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

//retrieve data from schema
exports.retrieveAll = () => {
    return Playlist.find().populate('artistId').populate('genreId').lean();
};
//CRUD
//create
exports.createPlaylist = function (playlistData) {
    return Playlist.create(playlistData);
}
//read
exports.getPlaylistById= function(id){
    return Playlist.findOne({_id: id})
}

//find user playlist
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
exports.getPlaylistByNameAndUser = (username, pname) => {
    return Playlist.findOne({username, pname});
}

exports.deleteAllUserPlaylists = (username) => {
    return Playlist.deleteMany({ username: username });
};

