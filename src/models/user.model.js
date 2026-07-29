const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    watchHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "video"
        }
    ],
    username: {
        type: String,
        required: [true,'user must have an username'],
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    }, 
    email: {
        type: String,
        required: [true,'user must have an email'],
        lowercase: true,
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: [true,'full name is required'],
        trim: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true,'user must have a password'],
        minLength: [8,'password must be of atleast 8 characters'],
        maxLength: [20,'password must be less than 20 characters '],
        trim: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel