const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const commentModel = require("../models/comment.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")
const videoModel = require('../models/video.model')
const tweetModel = require("../models/tweet.model")


const commentOnVideo = asyncHandler(async function (req, res) {

    const { video_id } = req.params
    const curr_user_id = req.user._id
    const { comment } = req.body

    if (!comment) {
        throw new apiError(400, "comment is required")
    }

    await commentModel.create({
        content: comment,
        video: video_id,
        owner: curr_user_id
    })

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
        throw new apiError(400, "could'nt comment")
    }

    return res.status(200).json(
        new apiResponse(200, "commented successfully", comments)
    )
})


const commentOnTweet = asyncHandler(async function (req, res) {

    const { tweet_id } = req.params
    const curr_user_id = req.user._id
    const { comment } = req.body

    if (!comment) {
        throw new apiError(400, "comment is required")
    }

    await commentModel.create({
        content: comment,
        tweet: tweet_id,
        owner: curr_user_id
    })

    const comments = await commentModel.aggregate([
        {
            $match: { tweet: new mongoose.Types.ObjectId(tweet_id) }
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
        throw new apiError(400, "could'nt comment")
    }

    return res.status(200).json(
        new apiResponse(200, "commented successfully", comments)
    )
})


const deleteVideoComment = asyncHandler(async function (req, res) {

    const curr_user_id = req.user._id
    const { video_id, comment_id } = req.params

    const comment = await commentModel.findOneAndDelete(
        {
            _id: comment_id,
            video: video_id,
            owner: curr_user_id
        }
    )

    if (!comment) {
        throw new apiError(400, "could'nt find comment")
    }

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
        throw new apiError(400, "could'nt delete comment")
    }

    return res.status(200).json(
        new apiResponse(200, "commented deleted successfully", comments)
    )
})


const deleteTweetComment = asyncHandler(async function (req, res) {
    const curr_user_id = req.user._id
    const { comment_id, tweet_id } = req.params

    const comment = await commentModel.findOneAndDelete(
        {
            _id: comment_id,
            tweet: tweet_id,
            owner: curr_user_id
        }
    )

    if (!comment) {
        throw new apiError(400, "could'nt find comment")
    }

    const comments = await commentModel.aggregate([
        {
            $match: { tweet: new mongoose.Types.ObjectId(tweet_id) }
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
        throw new apiError(400, "could'nt delete comment")
    }

    return res.status(200).json(
        new apiResponse(200, "commented deleted successfully", comments)
    )
})


module.exports = { commentOnVideo, commentOnTweet, deleteVideoComment, deleteTweetComment }