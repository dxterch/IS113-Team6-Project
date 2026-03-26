const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    dateJoined: { type: Date, default: Date.now },
 // This tells the system whether the account is a normal user or an admin
    role: {
        type: String,
        enum: ["user", "admin"], // only these 2 values are allowed
        default: "user" // every new account becomes a normal user by default
    }
});

module.exports = mongoose.model('User', userSchema);