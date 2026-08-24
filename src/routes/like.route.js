const express = require("express")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddleware = require("../middlewares/user.middleware.js")
const videoControllers = require("../controllers/video.controller.js")
const commentController = require("../controllers/comment.controller.js")
const likeController = require("../controllers/like.controller.js")



//video
route.get("/video/:video_id", authMiddleware,  likeController.likeVideo)

//tweet
route.post("/tweet/:tweet_id", authMiddleware, likeController.liketweet)

//comment
route.post("/comment/:comment_id", authMiddleware, likeController.likeComment)


module.exports = route