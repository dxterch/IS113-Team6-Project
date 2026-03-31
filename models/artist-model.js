const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    artistName: { type: String, required: [true, 'Artist Name is Required.'], unique: true},
    artistGenre: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: [true, 'At least one genre is required.']
    }],
    artistBio: { type: String, required: [true, 'Artist Biography is Required.']},
    artistCountry: { type: String, required: [true, 'Country of Artist is Required.']},
    artistGender: { type: String, enum: ['Male', 'Female', 'Non-Binary', 'Other'], required: [true, 'Artist Gender is Required.']},
    artistImage: { type: String, default: "default_artist.png" },
    artistDateAdded: { type: Date, default: Date.now }
});

const Artist = mongoose.model('Artist', artistSchema);

// Model Function for Data Retrieval
exports.retrieveAll = () => {
    return Artist.find().populate('artistGenre');
};

// Model Function for Creating an Artist
exports.createArtist = (artist) => {
    return Artist.create(artist);
};

// Model Function for Finding Artist by ID
exports.findById = (id) => {
    return Artist.findById(id);
};

// Model Function for Deleting an Artist
exports.deleteById = (id) => {
    return Artist.findByIdAndDelete(id);
};

// Model Function for Updating an Artist
exports.updateArtist = (id, data) => {
    return Artist.updateOne({ _id: id }, data);
};

exports.search = (searchTerm) => {
    let query = {};
    if (searchTerm) {
        query.artistName = { $regex: searchTerm, $options: 'i' };
    }
    return Artist.find(query).populate('artistGenre');
}