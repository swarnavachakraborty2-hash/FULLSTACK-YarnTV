const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const subscriptionModel = require("../models/subscription.model")
const videoModel = require("../models/video.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")
const uploadFile = require("../utils/cloudinary")


const createVideo = asyncHandler(async function (req, res) {

    const { title, description } = req.body

    const uploadedVideo = req.files.videoFile
    const thumbnail = req.files.thumbnail
    console.log(uploadedVideo[0])

    if (!uploadedVideo) {
        throw new apiError(400, "video is required")
    }

    const VideoResult = await uploadFile(uploadedVideo[0].path)
    const Thumbnailresult = await uploadFile(thumbnail[0].path)
    console.log(VideoResult)

    const video = await videoModel.create(
        {
            videoFile: VideoResult.url,
            thumbnail: Thumbnailresult.url,
            owner: req.user._id,
            title: title,
            description: description ? description : "",
            duration: VideoResult.duration
        }
    )

    if (!video) {
        throw new apiError(400, "video is not created!!")
    }

    return res.status(201).json(
        new apiResponse(200, "video created successfully", video)
    )
})


const deleteVideo = asyncHandler(async function (req, res) {

    const user_id = req.user._id
    const { videoId } = req.params

    const video = await videoModel.findOne(
        {
            _id: videoId
        }
    )
    if (!video) {
        throw new apiError(400, "can't find video")
    }

    if (video.owner != user_id) {
        throw new apiError(401, "unauthorised request")
    }

    const Video = await videoModel.findByIdAndDelete(
        { _id: videoId }
    )
    return res.status(200).json(
        new apiResponse(200, "video deleted successfully")
    )
})

const updateVideoDetails = asyncHandler(async function (req, res) {

    const user_id = req.user._id
    const { videoId } = req.params
    const { title, description } = req.body

    if (!title && !description) {
        throw new apiError(400, "title or description is required")
    }

    const video = await videoModel.findOneAndUpdate(
        {
            _id: videoId
        },
        {
            title: title,
            description: description
        },
        {
            new: true
        }
    )

    if (!video) {
        throw new apiError(400, "can't find video")
    }

    return res.status(200).json(
        new apiResponse(200, "video updated successfully")
    )
})

module.exports = { createVideo, deleteVideo, updateVideoDetails }