const mongoose = require('mongoose')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: "video"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    })

commentSchema.plugin(mongooseAggregatePaginate)

const commentModel = mongoose.model("comment", commentSchema)

module.exports = commentModel