const PlaylistFunctionalities= require("../models/playlist-model");
const Song = require("../models/song-model");
//after delete/create playlist, go to the list of playlists page (manage-list)
//after editing playlist, goes into playlist

//save edits (/edit)
exports.savePlaylist = async (req, res)=>{
    try{
        const playlistId = req.body.playlistId;
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
        
        if (!songArray || songArray.length===0){
            const allSongs= await Song.find()

            return res.render("playlists/create-playlist",{
                playlist:playlistId?{_id: playlistId, songs:[]}:null,
                pname, 
                songs: allSongs, 
                caption,
                selectedSongs:[], 
                error: "Please select at least 1 song"
            })
        }
        // Create variable to hold final Playlist ID
        let redirectId;

        if (playlistId){
            await PlaylistFunctionalities.updatePlaylist(playlistId,{
                pname, caption, songs: songArray
            });
            // Set ID for redirect
            redirectId = playlistId;
        }else{
            const existing = await PlaylistFunctionalities.getPlaylistByName(pname);
            if (existing){
                const allSongs = await Song.retrieveAll();
                return res.render("playlists/create-playlist",
                        {playlist: null, pname, songs:allSongs, caption,
                        error: "Playlist name already taken, please choose another."
                        }
                );
            }

            // Capture the newly created Playlist
            const newPlaylist = await PlaylistFunctionalities.createPlaylist({
                username: req.session.username, pname, caption, songs: songArray
            });
            
            // Obtain the new database ID
            redirectId = newPlaylist._id;
        }
        // Redirect using redirectId variable
        res.redirect(`/playlists/view?playlistId=${redirectId}`)
    }catch (error){
        console.log(error)
        res.render("main/error-page", { error: "Error saving playlist" });
    }
};

//create new (new-playlist)
exports.showCreatePlaylistForm =  async (req, res)=>{
    try{
        // const id = req.query.playlistId;
        // const playlist = await PlaylistFunctionalities.getPlaylistById(id);
        const songs = await Song.retrieveAll().populate('artistId').populate('genreId').lean();
        // if (!req.query.songs || req.query.songs.length===0){
        //     return res.render("playlists/create-playlist",{
        //         error: "Please select at least 1 song",
        //     playlist:null, pname:"", songs: songs || [], error: null});
        // };
        res.render("playlists/create-playlist", {
            playlist:null, pname:"", songs: songs || [], error: null, caption: ''});
    }catch (error){
        console.log(error);
        res.render("main/error-page", { error: "Error loading form to manage playlist" });
    }
};

//update existing (edit-form)
exports.showEditPlaylistForm = async (req, res)=>{
    try{
        const id = req.query.playlistId;
        const playlist = await PlaylistFunctionalities.getPlaylistById(id);
        const songs = await Song.find()
            .populate('artistId')
            .populate("genreId").lean();
        if (!playlist){
            return res.send("Playlist not found");
        }
        res.render("playlists/create-playlist", {
            playlist, pname: playlist.pname, songs, error: null, caption});
    }catch(error){
        console.log(error);
        res.render("main/error-page", { error: "Error loading playlist" });
    }
};
// display all playlists for a user (manage-list)
exports.showAllPlaylist = async (req, res) => {
    try{
        //const playlist = await PlaylistFunctionalities.getPlaylistById(id);
        const songs = await Song.find().populate('artistId').populate("genreId").lean();
        const playlists = await PlaylistFunctionalities.getUserPlaylists(req.session.username);
        res.render("playlists/manage-playlist", {playlists, songs})
    }catch (error){
        console.log(error);
        res.render("main/error-page", { error: "Error loading playlist" });
    }
};
//delete (delete)
exports.deletePlaylist = async (req, res) =>{
    try{
        const {playlistId} = req.body;
        await PlaylistFunctionalities.deletePlaylist(playlistId);
        res.redirect("manage-list");
    }catch(error){
        console.log(error)
        res.render("main/error-page", { error: "Error deleting playlist" });
    }
};
//see playlist
exports.getPlaylistById = async (req, res) =>{
    try{
        //const songs = await Song.find().populate('artistId').populate("genreId").lean();
        let selectedSongs = req.query.songId;
        if (!Array.isArray(selectedSongs)){
            selectedSongs = [selectedSongs]
        }
        const playlistId = req.query.playlistId
        const playlist = await PlaylistFunctionalities.
            getPlaylistById(playlistId)
            .populate({
                path: "songs",
                populate:[
                    {path:"artistId"},
                    {path: "genreId"
                    }
    ]})
            .lean()
        if (!playlist){
            return res.send("Playlist not found");
        }
        res.render("playlists/view-playlist", {playlist, error:null})
    }catch (error){
        console.log(error);
        res.render("main/error-page", { error: "Error finding playlist" });
    }
}