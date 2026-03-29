const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
    base64Data: String,
    songID: string
}); 

const Photo = mongoose.model('Photo', photoSchema, 'photos');

//Methods 
