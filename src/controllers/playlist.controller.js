const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const commentModel = require("../models/comment.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")
const videoModel = require('../models/video.model')
const tweetModel = require("../models/tweet.model")
const playlistModel = require("../models/playlist.model")


const createPlaylist = asyncHandler(async function (req, res) {

    const { name, description, video_id } = req.body
    const curr_user_id = req.user._id


    if (!name) {
        throw new apiError(400, "name is required")
    }

    const playlist = await playlistModel.create(
        {
            name: name,
            description: description ? description : "",
            videos: video_id ? [video_id] : [],
            owner: curr_user_id
        }
    )

    if (!playlist) {
        throw new apiError(400, "could'nt create playlist")
    }

    return res.status(200).json(
        new apiResponse(200, "playlist created successfully", playlist)
    )


})


const updateDetails = asyncHandler(async function (req, res) {

    const { title, description } = req.body
    const { playlist_id } = req.params

    if (!(title || description)) {
        throw new apiError(400, "title or description is required")
    }

    const playlist = await playlistModel.findOneAndUpdate(
        {
            _id: playlist_id
        },
        {
            title: title,
            description: description
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new apiResponse(200, "playlist updated successfully", playlist)
    )
})


const deletePlaylist = asyncHandler(async function (req, res) {

    const curr_user_id = req.user._id
    const { playlist_id } = req.params

    const playlist = await playlistModel.findOneAndDelete(
        {
            _id: playlist_id,
            owner: curr_user_id
        }
    )

    if (!playlist) {
        throw new apiError(400, "can't find playlist")
    }

    return res.status(200).json(
        new apiResponse(200, "playlist deleted successfully")
    )
})

const saveVideoToPlaylist = asyncHandler(async function (req, res) {

    const { playlist_id, video_id } = req.params
    const curr_user_id = req.user._id

    const playlist = await playlistModel.findOne(
        {
            _id: playlist_id,
            owner: curr_user_id

        })

    playlist.videos.push(video_id)
    await playlist.save()

    return res.status(200).json(
        new apiResponse(200, "video saved to playlist successfully")
    )

})

const deleteVideoFromPlaylist = asyncHandler(async function (req, res) {

    const { playlist_id, video_id } = req.params
    const curr_user_id = req.user._id

    const playlist = await playlistModel.findOne(
        {
            _id: playlist_id,
            owner: curr_user_id

        })

    if (!playlist) {
        throw new apiError(400, "can't find playlist")
    }

    playlist.videos.pull(video_id)
    await playlist.save()

    return res.status(200).json(
        new apiResponse(200, "video saved to playlist successfully")
    )
})


const getUserChannelPlaylists = asyncHandler(async function (req, res) {

    const { user_id } = req.params

    const playlists = await playlistModel.aggregate([
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
                as: "owner_details",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "thumbnail",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner_details: {
                    $first: "$owner_details"
                },
                videos: {
                    $size: "$videos"
                },
                thumbnail: {
                    $first: "$thumbnail"
                }
            }
        },
        {
            $project: {
                name: 1,
                owner_details: 1,
                videos: 1,
                thumbnail: 1
            }
        }
    ])

    if(!playlists?.length){
        throw new apiError(400,"could'nt fetch playlists")
    }

    return res.status(200).json(
        new apiResponse(200, "playlists fetched successfully")
    )
})


module.exports = { createPlaylist, updateDetails, deletePlaylist, saveVideoToPlaylist, getUserChannelPlaylists, deleteVideoFromPlaylist }