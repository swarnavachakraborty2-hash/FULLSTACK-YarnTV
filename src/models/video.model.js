const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    //_id
    videoFile: {
        type: String,
        required: [true,'upload a video first']
    },
    thumbnail: {
        type: String,
        required: [true,'thumbnail is required']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "user"//user_id
    },
    title: {
        type: String,
        required: [true, 'add a title'] 
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const videoModel = mongoose.model("video", videoSchema)

module.exports = videoModel