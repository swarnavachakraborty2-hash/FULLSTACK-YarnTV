const mongoose = require('mongoose')

const videoSchema = new mongoose.schema({

})

const videoModel = mongoose.model("video", videoSchema)

module.exports = videoModel