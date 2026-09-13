const mongoose = require('mongoose')


const playlistSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    })

const playlistModel = mongoose.model("playlist", playlistSchema)

module.exports = playlistModel