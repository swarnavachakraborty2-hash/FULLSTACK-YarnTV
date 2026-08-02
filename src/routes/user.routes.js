const express = require("express")
const userControllers = require("../controllers/user.contollers.js")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")

/* .fields() accept different types of files in an array*/
route.post("/register", upload.fields([
    {name: "avatar",//name of the field
     maxCount: 1// number of field of this type
    },
    {name: "coverImage",
     maxCount: 1
    }
]), userControllers.register)


module.exports = route