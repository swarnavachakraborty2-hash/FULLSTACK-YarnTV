const mongoose = require('mongoose')
const asyncHandler = require('../utils/asyncHandler')
const userModel = require("../models/user.model")
const subscriptionModel = require("../models/subscription.model")
const apiError = require("../utils/apiError")
const apiResponse = require("../utils/apiResponse")


const userSubscription = asyncHandler(async function (req, res) {

    const curr_user_id = new mongoose.Types.ObjectId(req.user._id)
    const { username } = req.params

    const channel = await userModel.findOne({ username: username })

    const subscribeModel = await subscriptionModel.findOne({
        subscriber: curr_user_id
    })

    if (!subscribeModel) {
        await subscriptionModel.create(
            {
                channel: channel._id,
                subscriber: curr_user_id
            }
        )
    }
    else {
        await subscriptionModel.findOneAndDelete(
            {
                channel: channel._id,
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

module.exports = { userSubscription }