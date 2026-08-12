const asyncHandler = require("../utils/asyncHandler.js")
const userModel = require("../models/user.model.js")
const apiError = require("../utils/apiError.js")
const apiResponse = require("../utils/apiResponse.js")
const uploadFile = require("../utils/cloudinary.js")
const jwt = require('jsonwebtoken')


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
            _id: req.user
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


    const user = await userModel.findByIdAndDelete({ _id: req.user })

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

    const user = await userModel.findById({ user_id })

    if (IncomingRefreshToken != user.refreshToken) {
        throw new apiError(401, "invalid Refresh token")
    }

    const AccessToken = await user.generateAccessToken()
    const RefreshToken = await user.generateRefreshToken()

    return res.status(200)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json( 
            new apiResponse(201, "refreshed access token", {AccessToken, RefreshToken})
        )
})


module.exports = { Register, Login, Logout, DeleteAccount, RefreshAccessToken }

