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


//CRUD
//create
exports.createPlaylist = function (playlistData) {
    return Playlist.create(playlistData);
}
//read
exports.getPlaylistById= function(id){
    return Playlist.findOne({_if: id})
}
exports.getUserPlaylists = function(uid){
    return Playlist.find({uid}) 
}

//update
exports.updatePlaylist = function (id, updateData) {
    return Playlist.updateOne({_id: id}, updateData)
}
//delete
exports.deletePlaylist = function (id) {
    return Playlist.deleteOne({_id: id})
}