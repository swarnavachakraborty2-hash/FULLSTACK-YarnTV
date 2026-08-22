const mongoose = require('mongoose')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')
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

    const video = await videoModel.findOneAndUpdate(
        {
            _id: videoId
        },
        {
            isPublished: false
        },
        {
            new: true
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
        new apiResponse(200, "video deleted successfully", Video)
    )
})


const updateVideoDetails = asyncHandler(async function (req, res) {

    const user_id = req.user._id
    const { videoId } = req.params
    const { title, description } = req.body

    if (!title && !description) {
        throw new apiError(400, "title or description is required")
    }

    const video = await videoModel.findOne(
        {
            _id: videoId
        }
    )
    if (video.owner != user_id) {
        throw new apiError(400, "unauthorised action")
    }

    if (!video) {
        throw new apiError(400, "can't find video")
    }

    video.title = title
    video.description = description
    await video.save()

    return res.status(200).json(
        new apiResponse(200, "video updated successfully")
    )
})



const getUserChannelVideos = asyncHandler(async function (req, res) {

    const { username } = req.params
    const user = await userModel.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "createdVideos"
            }
        },
        {
            $project: {
                avatar: 1,
                username: 1,
                createdVideos: 1
            }
        }
    ])

    if (!user?.length) {
        throw new apiError(400, "could'nt find videos")
    }

    return res.status(200).json(
        new apiResponse(200, "videos fetched successfully", user[0])
    )
})


const getFeedVideos = asyncHandler(async function (req, res) {

    const videos = await videoModel.aggregate([
        {
            $match: {}//no condition i.e. get all documents
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])

    if (!videos?.length) {
        throw new apiError(400, "could'nt find videos")
    }

    return res.status(200).json(
        new apiResponse(200, "videos fetched successfully", videos)
    )

})


const watchVideo = asyncHandler(async function (req, res) {

    const { video_id } = req.params

    const video = await videoModel.findOneAndUpdate(
        {
            _id: video_id
        }
    )

    if (!video) {
        throw new apiError(400, "could'nt find the video")
    }

    video.views = video.views + 1
    await video.save()


    return res.status(200).json(
        new apiResponse(200, "viewed successfully")
    )
})



const likeVideo = asyncHandler(async function (req, res) {

    const user_id = new mongoose.Types.ObjectId(req.user._id)
    const { video_id } = req.params

    const video = await videoModel.findById({
        _id: video_id
    })

    if (!video) {
        throw new apiError(400, "could'nt find the video")
    }

    if (video.likes.includes(user_id)) {
        video.likes.pull(user_id)
        await video.save()

        return res.status(200).json(
            new apiResponse(200, "video unliked successfully", {
                likes: video.likes.length,
                isLiked: false
            }))
    }

    video.likes.push(user_id)
    await video.save()

    return res.status(200).json(
        new apiResponse(200, "video liked successfully", {
            likes: video.likes.length,
            isLiked: true
        }))
})




module.exports = { createVideo, deleteVideo, updateVideoDetails, getUserChannelVideos, getFeedVideos, watchVideo, likeVideo }