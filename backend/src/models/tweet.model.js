const mongoose = require('mongoose')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')

const tweetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const tweetModel = mongoose.model("tweet", tweetSchema)

module.exports = tweetModel