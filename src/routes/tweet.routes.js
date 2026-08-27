const express = require("express")
const route = express.Router()
const authMiddleware = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")
const tweetController = require("../controllers/tweet.controller.js")

route.post("/create-tweet", authMiddleware, tweetController.createTweet)//due

route.delete("/delete-tweet/:tweet_id", authMiddleware, tweetController.deleteTweet)//due

route.get("/get-feed-tweets", authMiddleware, tweetController.getfeedTweets)//due

route.get("/get-user-tweets/:user_id", authMiddleware, tweetController.getUserTweets)//due

route.post("/comment-tweet/:tweet_id", authMiddleware, commentController.commentOnTweet)//due

route.post("/delete-comment-tweet/:tweet_id/:comment_id", authMiddleware, commentController.deleteTweetComment)//due

route.get("/get-comments-tweet/:tweet_id", authMiddleware, tweetController.getCommentstweet)//due

module.exports = route