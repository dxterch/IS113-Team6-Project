const PlaylistFunctionalities= require("../models/playlist-model");
const Song = require("../models/song-model");
//after delete/create playlist, go to the list of playlists page (manage-list)
//after editing playlist, goes into playlist

//save edits (/edit)
exports.savePlaylist = async (req, res)=>{
    try{
        const playlistId = req.body._id;
        const pname = req.body.pname;
        const caption = req.body.caption;
        const songs = req.body.songs;
        let songArray;
        
        if (Array.isArray(songs)){
            songArray = songs;
        }else if (songs){
            songArray=[songs];
        } else{
            songArray=[];
        }

        if (playlistId){
            await PlaylistFunctionalities.updatePlaylist(playlistId,{
                pname, caption, songs: songArray
            });
        }else{
            //* Remove 'playlistId' argument and changed 'uid' to 'username'
            await PlaylistFunctionalities.createPlaylist({
                username: req.session.username, pname, caption, songs: songArray
            })
        }
        res.redirect("/playlists/manage-list")
    }catch (error){
        console.log(error)
        res.send("Error saving playlist");
    }
};

//create new (new-playlist)
exports.showCreatePlaylistForm =  async (req, res)=>{
    try{
        const songs = await Song.retrieveAll();
        res.render("manage-playlist", {
            playlist:null, pname:"", songs});

    }catch (error){
        console.log(error);
        res.send("Error loading form to manage playlist");
    }
};

//update existing (edit-form)
exports.showEditPlaylistForm = async (req, res)=>{
    try{
        const id = req.body.playlistId;
        const playlist = await PlaylistFunctionalities.getPlaylistById(id);
        const songs = await Song.retrieveAll();
        if (!playlist){
            return res.send("Playlist not found");
        }
        res.render("manage-playlist", {
            playlist, pname: playlist.pname, songs});
    }catch(error){
        console.log(error);
        res.send("Error loading playlist");
    }
};
// display all playlists for a user (manage-list)
exports.showAllPlaylist = async (req, res) => {
    try{
        const playlists = await PlaylistFunctionalities.getUserPlaylists(req.session.username);
        res.render("create-manage-playlist", {playlists})
    }catch (error){
        console.log(error);
        res.send("Error loading playlists");
    }
};
//delete (delete)
exports.deletePlaylist = async (req, res) =>{
    try{
        const {playlistId} = req.body;
        await PlaylistFunctionalities.deletePlaylist(playlistId);
        res.redirect("/playlists/manage-list");
    }catch(error){
        console.log(error)
        res.send("Error deleting playlist");
    }
};