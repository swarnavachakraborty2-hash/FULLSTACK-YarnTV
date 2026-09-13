const mongoose = require('mongoose')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')

const likeSchema = new mongoose.Schema({
    // constains comment id if liked to comment or video or twwet
    comment: {
        type: mongoose.Types.ObjectId,
        ref: "comment",
        default: null
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: "video",
        default: null
    },
    tweet: {
        type: mongoose.Types.ObjectId,
        ref: "tweet",
        default: null
    },
    likedBy: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
},
{
    timestamps: true
})

const likeModel = mongoose.model("like", likeSchema)

module.exports = likeModel