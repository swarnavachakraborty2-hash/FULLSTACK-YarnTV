const express = require("express")
const userControllers = require("../controllers/user.contollers.js")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddlewares = require("../middlewares/user.middleware.js")



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

route.get("/logout", authMiddlewares.requiredMiddleware, userControllers.Logout)

route.delete("/deleteAccount", authMiddlewares.requiredMiddleware, userControllers.DeleteAccount)

route.get("/refresh-token", userControllers.RefreshAccessToken)

route.patch("/change-password", authMiddlewares.requiredMiddleware, userControllers.changeUserPassword)

route.get("/curr-user", authMiddlewares.requiredMiddleware, userControllers.getCurrentUser)

route.patch("/edit-account", authMiddlewares.requiredMiddleware, userControllers.changeAccountDetails)// edit username or email

route.patch("/edit-avatar", authMiddlewares.requiredMiddleware, upload.single("avatar"), userControllers.updateAvatar)

route.patch("/edit-coverImage", authMiddlewares.requiredMiddleware, upload.single("coverImage"), userControllers.updateCoverImage)


//functions on different users
route.get("/profile/:username", authMiddlewares.requiredMiddleware, userControllers.getUserChannel)


module.exports = route 
