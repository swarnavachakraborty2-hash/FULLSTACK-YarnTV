const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const commentModel = require("../models/comment.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")
const videoModel = require('../models/video.model')
const tweetModel = require("../models/tweet.model")
const likeModel = require("../models/like.model")


const likeVideo = asyncHandler(async function (req, res) {

    const { video_id } = req.params
    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)

    const liked = await likeModel.findOne({
        likedBy: curr_user_id,
        video: video_id
    })
    if (!liked) {
        await likeModel.create(
            {
                likedBy: curr_user_id,
                video: video_id
            }
        )
    }
    else {
        await likeModel.findOneAndDelete({
            likedBy: curr_user_id,
            video: video_id
        })
    }


    const video = await videoModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(video_id)
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
                likes: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                likes: 1,
                isLiked: 1
            }
        }
    ])

    if (!video?.length) {
        throw new apiError(400, "could'nt find likes")
    }

    if (!video[0].isLiked) {
        return res.status(200).json(
            new apiResponse(200, "video unliked successfully", video[0])
        )
    }

    return res.status(200).json(
        new apiResponse(200, "video liked successfully", video[0])
    )

})




const likeComment = asyncHandler(async function (req, res) {

    const { comment_id } = req.body
    const curr_user_id = mongoose.Types.ObjectId(req.user._id)

    const liked = await likeModel.findOne({
        likedBy: curr_user_id,
        comment: comment_id
    })
    if (!liked) {
        await likeModel.create(
            {
                likedBy: curr_user_id,
                comment: comment_id
            }
        )
    }
    else {
        await likeModel.findOneAndDelete({
            likedBy: curr_user_id,
            comment: comment_id
        })
    }


    const comment = await commentModel.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(comment_id)
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
                likes: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                likes: 1,
                isLiked: 1
            }
        }
    ])

    if (!comment?.length) {
        throw new apiError(400, "could'nt find likes")
    }

    if (!comment[0].isLiked) {
        return res.status(200).json(
            new apiResponse(200, "video unliked successfully", comment[0])
        )
    }

    return res.status(200).json(
        new apiResponse(200, "video liked successfully", comment[0])
    )

})



const liketweet = asyncHandler(async function (req, res) {

    const { tweet_id } = req.body
    const curr_user_id = mongoose.Types.ObjectId(req.user._id)

    const liked = await likeModel.findOne({
        likedBy: curr_user_id,
        tweet: tweet_id
    })
    if (!liked) {
        await likeModel.create(
            {
                likedBy: curr_user_id,
                tweet: tweet_id
            }
        )
    }
    else {
        await likeModel.findOneAndDelete({
            likedBy: curr_user_id,
            tweet: tweet_id
        })
    }


    const tweet = await tweetModel.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(tweet_id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes"
            }
        },
        {
            $addFields: {
                likes: {
                    $size: "$likes"
                },
                isLiked: {
                    $cond: {
                        if: { $in: [curr_user_id, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                likes: 1,
                isLiked: 1
            }
        }
    ])

    if (!tweet?.length) {
        throw new apiError(400, "could'nt find likes")
    }

    if (!tweet[0].isLiked) {
        return res.status(200).json(
            new apiResponse(200, "video unliked successfully", tweet[0])
        )
    }

    return res.status(200).json(
        new apiResponse(200, "video liked successfully", tweet[0])
    )

})



module.exports = {likeVideo, likeComment, liketweet}