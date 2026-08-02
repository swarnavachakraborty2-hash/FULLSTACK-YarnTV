const asyncHandler = require("../utils/asyncHandler.js")
const userModel = require("../models/user.model.js")
const apiError = require("../utils/apiError.js")
const apiResponse = require("../utils/apiResponse.js")
const uploadFile = require("../utils/cloudinary.js")



/*stores the response */      /*this funtion is passed as a parameter*/
const register = asyncHandler(async function (req, res) {

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

    let avatarURL = ""
    if (req.files.avatar) {
        avatarURL = await uploadFile(req.files.avatar[0].path)//upload the path of the file that was uploaded to multer and stored in public/temp path
    }
    else {
        throw new apiError(400, "avatar is required")
    }


    const coverImageLocalPath = req.files.coverImage[0].path
    const coverURL = await uploadFile(coverImageLocalPath)//uploaded the localpath of the file as a parameter


    const user = await userModel.create({
        username: username,
        email: email,
        fullname: fullname,
        avatar: avatarURL.url,
        coverImage: coverURL?.url || "",
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

module.exports = { register }

