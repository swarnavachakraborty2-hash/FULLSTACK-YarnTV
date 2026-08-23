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

    const comments = await commentModel.find({ video: video_id })
    if (!comments) {
        throw new apiError(400, "could'nt find the updated comments")
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

    const comments = await commentModel.find({ tweet: tweet_id })
    if (!comments) {
        throw new apiError(400, "could'nt find the updated comments")
    }


    return res.status(200).json(
        new apiResponse(200, "commented successfully", comments)
    )
})


const deleteVideoComment = asyncHandler(async function (req, res) {

    const curr_user_id = req.user._id
    const { comment_id, video_id } = req.params

    const comment = commentModel.findOneAndDelete(
        {
            _id: comment_id,
            video: video_id,
            owner: curr_user_id
        }
    )

    if (!comment) {
        throw new apiError(400, "could'nt find comment")
    }

    const VideoComments = await commentModel.find(
        {
            _id: video_id
        }
    )

    return res.status(200).json(
        new apiResponse(200, "comment deleted successfully", VideoComments)
    )
})


const deleteTweetComment = asyncHandler(async function (req, res) {
    const curr_user_id = req.user._id
    const { comment_id, tweet_id } = req.params

    const comment = commentModel.findOneAndDelete(
        {
            _id: comment_id,
            tweet: tweet_id,
            owner: curr_user_id
        }
    )

    if (!comment) {
        throw new apiError(400, "could'nt find comment")
    }

    const tweetComments = await commentModel.find(
        {
            _id: tweet_id
        }
    )

    return res.status(200).json(
        new apiResponse(200, "comment deleted successfully", tweetComments)
    )
})


module.exports = { commentOnVideo, commentOnTweet, deleteVideoComment, deleteTweetComment }