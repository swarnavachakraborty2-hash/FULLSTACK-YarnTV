const express = require("express")
const userControllers = require("../controllers/user.contollers.js")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddleware = require("../middlewares/user.middleware.js")

/* .fields([{},{},..]) accept different types of files in an array*/
route.post("/register", upload.fields([
    {name: "avatar",//name of the field
     maxCount: 1// number of field of this type
    },
    {name: "coverImage",
     maxCount: 1
    }
]), userControllers.Register)

route.post("/login",  userControllers.Login)

route.get("/logout", authMiddleware, userControllers.Logout)

route.get("/deleteAccount", authMiddleware, userControllers.DeleteAccount)

route.get("/refresh-token",  userControllers.RefreshAccessToken)


module.exports = route