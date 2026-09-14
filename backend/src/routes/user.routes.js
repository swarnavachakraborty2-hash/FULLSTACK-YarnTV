const express = require("express")
const userControllers = require("../controllers/user.contollers.js")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddleware = require("../middlewares/user.middleware.js")



//functions on current users only
/* .fields([{},{},..]) accept different types of files in an array*/
route.post("/register", upload.fields([
    {
        name: "avatar",//name of the field
        maxCount: 1// number of field of this type
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), userControllers.Register)

route.post("/login", userControllers.Login)

route.get("/logout", authMiddleware, userControllers.Logout)

route.delete("/deleteAccount", authMiddleware, userControllers.DeleteAccount)

route.get("/refresh-token", userControllers.RefreshAccessToken)

route.patch("/change-password", authMiddleware, userControllers.changeUserPassword)

route.get("/curr-user", authMiddleware, userControllers.getCurrentUser)

route.patch("/edit-account", authMiddleware, userControllers.changeAccountDetails)// edit username or email

route.patch("/edit-avatar", authMiddleware, upload.single("avatar"), userControllers.updateAvatar)

route.patch("/edit-coverImage", authMiddleware, upload.single("coverImage"), userControllers.updateCoverImage)


//functions on different users
route.get("/profile/:username", authMiddleware, userControllers.getUserChannel)


module.exports = route 