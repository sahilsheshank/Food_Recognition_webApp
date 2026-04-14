const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 12
    },
    userData: {
        weight: {
            type: String,
            required: false, // ← changed
        },
        goalWeight: {
            type: String,
            required: false,
        },
        height: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            required: false,
        },
        activity: {
            type: String,
            required: false,
        },
    },

}, { timestamps: true })


const userModel = mongoose.model("users", userSchema);

module.exports = userModel;