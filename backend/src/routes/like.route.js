const express = require("express")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddlewares = require("../middlewares/user.middleware.js")
const videoControllers = require("../controllers/video.controller.js")
const commentController = require("../controllers/comment.controller.js")
const likeController = require("../controllers/like.controller.js")



//video
route.get("/video/:video_id", authMiddlewares.requiredMiddleware,  likeController.likeVideo)

//tweet
route.get("/tweet/:tweet_id", authMiddlewares.requiredMiddleware, likeController.liketweet)

//comment
route.get("/comment/:comment_id", authMiddlewares.requiredMiddleware, likeController.likeComment)


module.exports = route
