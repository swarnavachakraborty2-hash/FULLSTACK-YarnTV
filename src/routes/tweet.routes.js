const express = require("express")
const route = express.Router()
const authMiddleware = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")


route.post("/create-tweet", authMiddleware)//due

route.delete("/delete-tweet", authMiddleware)//due

route.get("/get-tweets", authMiddleware)//due

route.get("/get-my-tweets", authMiddleware)

route.post("/comment-tweet/:tweet_id", authMiddleware, commentController.commentOnTweet)

route.post("/delete-comment-tweet/:tweet_id/:comment_id", authMiddleware, commentController.deleteTweetComment)

route.get("/get-comments-tweet/:tweet_id", authMiddleware)//due

module.exports = route