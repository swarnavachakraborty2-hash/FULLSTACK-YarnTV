const express = require("express")
const route = express.Router()
const authMiddleware = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")
const likeController = require("../controllers/like.controller.js")


route.post("/comment-tweet/:tweet_id", authMiddleware, commentController.commentOnTweet)

route.post("/delete-comment-tweet/:tweet_id/:comment_id", authMiddleware, commentController.deleteTweetComment)

route.post("/like-tweet/:tweet_id", authMiddleware, likeController.liketweet)

module.exports = route