const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const subscriptionModel = require("../models/subscription.model")
const videoModel = require("../models/video.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")
const uploadFile = require("../utils/cloudinary")
const likeModel = require('../models/like.model')
const commentModel = require('../models/comment.model')


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

    const video = await videoModel.findOneAndDelete(
        {
            _id: videoId,
            owner: user_id
        }
    )
    if (!video) {
        throw new apiError(400, "can't find video")
    }

    return res.status(200).json(
        new apiResponse(200, "video deleted successfully", video)
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
                as: "createdVideos",
                pipeline: [
                    {
                        $addFields: {
                            views: {$size: "$views"}
                        }
                    }
                ]
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
                },
                views: {$size: "$views"}
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

    const curr_user_id = req.user._id
    const { video_id } = req.params

    const video = await videoModel.findOne(
        {
            _id: video_id
        }
    )

    const curr_user = await userModel.findOne({ _id: curr_user_id })
    curr_user.watchHistory.push(video_id)
    await curr_user.save()

    if (!video) {
        throw new apiError(400, "could'nt find the video")
    }

    video.views.push(curr_user_id)
    await video.save()


    return res.status(200).json(
        new apiResponse(200, "viewed successfully")
    )
})



const getLikedVideos = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)

    const likedVideos = await likeModel.aggregate([
        {
            $match: {
                likedBy: curr_user_id,
                video: { $exists: true } //video is not null
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                { $project: { username: 1, avatar: 1 } }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            },
                            views: {$size: "$views"}
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        }
    ])

    if (!likedVideos?.length) {
        throw new apiError(400, "could'nt fetch videos")
    }

    return res.status(200).json(
        new apiResponse(200, "videos fetched successfully", likedVideos)
    )
})

//get video page
const getVideo = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)
    const { video_id } = req.params

    const video = await videoModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(video_id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [curr_user_id, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            },
                            subscribers: { $size: "$subscribers" }
                        }
                    },
                    {
                        $project: { username: 1, avatar: 1, subscribers: 1, isSubscribed: 1 }
                    },

                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                likes: { $size: "$likes" },
                views: { $size: "$views" }
            }
        }
    ])

    if (!video?.length) {
        throw new apiError("could'nt find videos")
    }

    return res.status(200).json(
        new apiResponse(200, "video fetched successfully", video[0])
    )
})


const getCommentsVideo = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)
    const { video_id } = req.params

    const comments = await commentModel.aggregate([
        {
            $match: { video: new mongoose.Types.ObjectId(video_id) }
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
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                },
                likes: { $size: "$likes" }
            }
        }
    ])

    if (!comments?.length) {
        throw new apiError(400, "could'nt fetch comments")
    }

    return res.status(200).json(
        new apiResponse(200, "comments fetched successfully", comments)
    )
})


const searchVideosOnFeed = asyncHandler(async function (req, res) {

    const { letter } = req.body
    const regex = new RegExp(letter, "i")// "i" == case insensitive


    const videos = await videoModel.aggregate([
        {
            $match: {
                title: { $regex: regex }
            }// "regex" = get all documents with the particular string letter in title 
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

module.exports = { createVideo, deleteVideo, updateVideoDetails, getUserChannelVideos, getFeedVideos, watchVideo, getLikedVideos, getVideo, getCommentsVideo, searchVideosOnFeed }