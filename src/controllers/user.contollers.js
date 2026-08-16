const asyncHandler = require("../utils/asyncHandler.js")
const userModel = require("../models/user.model.js")
const apiError = require("../utils/apiError.js")
const apiResponse = require("../utils/apiResponse.js")
const uploadFile = require("../utils/cloudinary.js")
const jwt = require('jsonwebtoken')
const { default: mongoose } = require("mongoose")


const options = {
    httpOnly: true,
    secure: true
}//for secure cookies

/*stores the response */      /*this funtion is passed as a parameter*/
const Register = asyncHandler(async function (req, res) {

    const { username, fullname, email, password } = req.body


    if (username != "") {
        const usernameExists = await userModel.findOne({
            username: username
        })

        if (usernameExists) {
            throw new apiError(400, "username already in use")
        }
    }
    else {
        throw new apiError(400, "username is required") // throw incase of error
    }

    if (email != "") {
        const emailExists = await userModel.findOne({
            email: email
        })


        if (emailExists) {
            throw new apiError(400, "email already in use")
        }
    }
    else {
        throw new apiError(400, "email is required")
    }

    let avatarURL
    if (req.files.avatar) {

        avatarURL = await uploadFile(req.files.avatar[0].path)//upload the path of the file that was uploaded to multer and stored in public/temp path

    }
    else {
        throw new apiError(400, "avatar is required")
    }

    let coverURL
    const coverImage = req.files.coverImage
    if (coverImage) {
        coverURL = await uploadFile(req.files.coverImage[0].path)//uploaded the localpath of the file as a parameter
    }


    const user = await userModel.create({
        username: username,
        email: email,
        fullname: fullname,
        avatar: avatarURL.url,
        coverImage: coverImage ? coverURL.url : "",
        password: password
    })

    const userCreated = await userModel.findById({
        _id: user._id
    }).select("-password -refreshToken")//exclude these fields

    if (!userCreated) {
        throw new apiError(500, "something went wrong")
    }

    //finally return the response 
    return res.status(201).json(//use this format or return only the class 
        new apiResponse(200, "user registered successfully", user) //response object already created from this class
    )

    //do not "throw" normal response only use "return"

})



const Login = asyncHandler(async function (req, res) {

    const { username, email, password } = req.body

    if (username || email) {

        const user = await userModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (!user) {
            throw new apiError(404, "user does not exist")
        }

        const passwordMatched = user.isPasswordCorrect(password)
        if (passwordMatched) {

            const AccessToken = await user.generateAccessToken()
            const RefreshToken = await user.generateRefreshToken()

            user.refreshToken = RefreshToken
            user.save({ validateBeforeSave: false })// dont check constraints while saving this time(ex: required fields)

            return res.status(200)
                .cookie("AccessToken", AccessToken, options)
                .cookie("RefreshToken", RefreshToken, options)//set these two cookies in user browser
                .json(
                    new apiResponse(200, "user logged in successfully", user)
                )
        }
        else {
            throw new apiError(400, "incorrect password")
        }
    }
    else {
        throw new apiError(400, "username or email is required")
    }
})



const Logout = asyncHandler(async function (req, res) {


    const user = await userModel.findOneAndUpdate(
        {
            _id: req.user._id
        },
        {
            refreshToken: undefined
        },
        {
            returnDocument: "after"
        })


    res.status(200)
        .clearCookie("AccessToken", options)
        .clearCookie("RefreshToken", options)
        .json(
            new apiResponse(200, "logged out successfully", user)
        )
})



const DeleteAccount = asyncHandler(async function (req, res) {


    const user = await userModel.findByIdAndDelete({ _id: req.user._id })

    res.status(200)
        .clearCookie("AcessToken", options)
        .clearCookie("RefreshToken", options)
        .json(
            new apiResponse(200, "Account deleted successfully", user)
        )
})



//if user's access token reaches its time limit and error shows in request, check the refreshtoken from user request and compare it from db and regenerate access token
const RefreshAccessToken = asyncHandler(async function (req, res) {

    const IncomingRefreshToken = req.cookies.RefreshToken

    if (!IncomingRefreshToken) {
        throw new apiError(401, "unauthorised request")
    }

    const decoded = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user_id = decoded._id

    const user = await userModel.findById({ _id: user_id })

    if (IncomingRefreshToken != user.refreshToken) {
        throw new apiError(401, "invalid Refresh token")
    }

    const AccessToken = await user.generateAccessToken()
    const RefreshToken = await user.generateRefreshToken()

    return res.status(200)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new apiResponse(201, "refreshed access token", { AccessToken, RefreshToken })
        )
})



const changeUserPassword = asyncHandler(async function (req, res) {

    const { oldPassword, newPassword } = req.body
    const user_id = req.user._id

    if (!oldPassword) {
        throw new apiError(400, "password is required")
    }

    const user = await userModel.findById({ _id: user_id })

    const passwordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!passwordCorrect) {
        throw new apiError(400, "invalid password")
    }

    if (!newPassword) {
        throw new apiError(400, "password is required")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })// dont check other fields validations

    return res.status(200).json(
        new apiResponse(200, "password changed successfully", user)
    )
})



const getCurrentUser = asyncHandler(async function (req, res) {

    const userId = req.user._id

    const user = await userModel.findById({ _id: userId })

    if (!user) {
        throw new apiError(400, "something went wrong || account not found")
    }

    return res.status(200).json(
        new apiResponse(200, "user fetched successfully", user)
    )

})


const changeAccountDetails = asyncHandler(async function (req, res) {

    const userId = req.user._id
    const { username, email } = req.body

    if (!username && !email) {
        throw new apiError(400, "all fields are required")
    }

    const user = await userModel.findOneAndUpdate({
        _id: userId
    }, {
        username: username,
        email: email
    }, {
        new: true //finds / returns the user after update
    })


    return res.status(200).json(
        new apiResponse(200, "Account edited successfully", user)
    )

})



const updateAvatar = asyncHandler(async function (req, res) {

    const avatar = req.file
    const userId = req.user._id

    if (!avatar) {
        throw new apiError(400, "new avatar is required")
    }

    const result = await uploadFile(avatar.path)


    const user = await userModel.findOneAndUpdate({
        _id: userId
    }, {
        avatar: result.url
    }, {
        new: true
    })

    return res.status(200).json(
        new apiResponse(200, "avatar updated successfully", user)
    )
})


const updateCoverImage = asyncHandler(async function (req, res) {

    const coverImage = req.file
    const userId = req.user._id

    if (!coverImage) {
        throw new apiError(400, "new cover image is required")
    }

    const result = await uploadFile(coverImage.path)


    const user = await userModel.findOneAndUpdate({
        _id: userId
    }, {
        coverImage: result.url
    }, {
        new: true
    })

    return res.status(200).json(
        new apiResponse(200, "cover image updated successfully", user)
    )
})


const getUserChannel = asyncHandler(async function (req, res) {

    const { username } = req.params

    if (!username) {
        throw new apiError(400, "username is required")
    }

    //channel returns an array with data 
    const channel = await userModel.aggregate([
        {
            $match: {
                username: username //fetch the particular user's document in the first stage (just like findOne)
            }
        },
        {
            $lookup: {  //join this found user's document with its subscription models
                from: "subscriptions",// define to which collection to join
                localField: "_id",// the primary attribute of user model
                foreignField: "channel",// returns all the documents with channel == this user_id. Therefore no. of subscribers this user have in an array
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",// returns all the documents with subcriber == this user_id. Therefore no. of channels this user subscribed
                as: "subscribedTo"
            }
        },
        {
            $lookup: { //returns all the user's videos in an array 
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $addFields: {//adds an additional field allong with all the other fields of usermodel
                subscribersCount: {
                    $size: "$subscribers"//returns the size of subscribers array(all the documents returned with user_id == channel id)
                },
                subcsribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: { //this returns true or false based on if user is subscribed to the found user or not 
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: { //returns only these relevant fields in channel (projection)
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                subcsribedToCount: 1,
                isSubscribed: 1,
                videos: 1
            }
        }
    ])
    console.log(channel)

    if (!channel?.length) {
        throw new apiError(400, "channel does not exists")
    }

    return res.status(200).json(
        new apiResponse(200, "channel fetched successfully", channel[0])
    )                                                         //return the first object of the channel array instead of passing array
})



const getWatchHistory = asyncHandler(async function (req, res) {

    const user = await userModel.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.user._id) //mongoose does not automatically convert convert this to objectID here (we have to declare manually)
            }
        },
        {
            $lookup: {//creates an array field with all videos
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {//creates an array field(owner) inside videos of owner details
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",//returns all the properties of owner in video documents
                            pipeline: [
                                { $project: { username: 1, avatar: 1, fullname: 1 } }//return only these in the array
                            ]
                        }
                    },
                    {// replace the array in the owner field with the object inside the array for frontend array[0]
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                watch: 1
            }
        }
    ])

    if (!user?.length) {
        throw new apiError(400, "No videos watched")
    }

    return res.status(200).json(
        new apiResponse(200, "videos fetched successfully", user[0])
    )

})


module.exports = { Register, Login, Logout, DeleteAccount, RefreshAccessToken, changeUserPassword, getCurrentUser, changeAccountDetails, updateAvatar, updateCoverImage, getUserChannel, getWatchHistory }

