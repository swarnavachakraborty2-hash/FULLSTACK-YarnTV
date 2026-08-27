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
const tweetModel = require('../models/tweet.model')

const createTweet = asyncHandler(async function (req, res) {

    const curr_user_id = req.user._id
    const { content } = req.body

    if (!content) {
        throw new apiError(400, "content is required")
    }

    const tweet = await tweetModel.create(
        {
            owner: new mongoose.Types.ObjectId(curr_user_id),
            content: content
        }
    )

    if (!tweet) {
        throw new apiError(400, "could'nt create tweet")
    }

    return res.status(200).json(
        new apiResponse(200, "tweet created successfully", tweet)
    )

})


const deleteTweet = asyncHandler(async function (req, res) {

    const curr_user_id = req.user._id
    const { tweet_id } = req.params

    const tweet = await tweetModel.findOneAndDelete({ _id: tweet_id, owner: curr_user_id })

    if (tweet.owner != curr_user_id) {
        throw new apiError(400, "unauthorised action")
    }

    if (!tweet) {
        throw new apiError(400, "could'nt create tweet")
    }

    return res.status(200).json(
        new apiResponse(200, "tweet deleted successfully", tweet)
    )
})


const getfeedTweets = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)

    const tweets = await tweetModel.aggregate([
        {
            $match: {}
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: { username: 1, avatar: 1 }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localfield: "_id",
                foreignField: "tweet",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likes: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ])

    if (!tweets?.length) {
        throw new apiError(400, "coould'nt fetch tweets")
    }

    return res.status(200).json(
        new apiResponse(200, "tweets fetched successfully", tweets)
    )
})


const getUserTweets = asyncHandler(async function (req, res) {
    const { user_id } = req.params
    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)

    const tweets = await tweetModel.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(user_id)
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
                        $project: { username: 1, avatar: 1 }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localfield: "_id",
                foreignField: "tweet",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likes: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ])

    if (!tweets?.length) {
        throw new apiError(400, "coould'nt fetch tweets")
    }

    return res.status(200).json(
        new apiResponse(200, "tweets fetched successfully", tweets)
    )
})


const getCommentstweet = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)
    const { tweet_id } = req.params

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
        throw new apiError(400, "could'nt fetch comments")
    }

    return res.status(200).json(
        new apiResponse(200, "comments fetched successfully", comments)
    )
})



module.exports = { createTweet, deleteTweet, getfeedTweets, getUserTweets, getCommentstweet }