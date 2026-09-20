const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const subscriptionModel = require("../models/subscription.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")


const userSubscription = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)
    const { username } = req.params

    const userchannel = await userModel.findOne({ username: username })

    const subscribeModel = await subscriptionModel.findOne({
        channel: userchannel._id,
        subscriber: curr_user_id
    })

    if (!subscribeModel) {
        await subscriptionModel.create(
            {
                channel: userchannel._id,
                subscriber: curr_user_id
            }
        )
    }
    else {
        await subscriptionModel.findOneAndDelete(
            {
                channel: userchannel._id,
                subscriber: curr_user_id
            }
        )
    }

    const user = await userModel.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"//returns all subscribers of that user
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
                }
            }
        },
        {
            $project: {
                _id: 1,
                isSubscribed: 1
            }
        }
    ])

    if (!user?.length) {
        throw new apiError(400, "user did not found")
    }

    if (user[0].isSubscribed) {
        return res.status(200).json(
            new apiResponse(200, "subscribed successfully", user[0])
        )
    }

    return res.status(200).json(
        new apiResponse(200, "unsubscribed successfully", user[0])
    )
})


const getSubscribedToUsers = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)

    const usersVideos = await subscriptionModel.aggregate([
        {
            $match: {
                subscriber: curr_user_id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "channel",
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
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
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    if (!usersVideos?.length) {
        throw new apiError(400, "could'nt find users")
    }

    return res.status(200).json(
        new apiResponse(200, "users fetched successfully", usersVideos)
    )

})

module.exports = { userSubscription, getSubscribedToUsers }