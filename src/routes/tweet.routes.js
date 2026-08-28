const express = require("express")
const route = express.Router()
const authMiddleware = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")
const tweetController = require("../controllers/tweet.controller.js")


route.post("/create-tweet", authMiddleware, tweetController.createTweet)

route.delete("/delete-tweet/:tweet_id", authMiddleware, tweetController.deleteTweet)

route.get("/get-feed-tweets", authMiddleware, tweetController.getfeedTweets)

route.get("/get-user-tweets/:user_id", authMiddleware, tweetController.getUserTweets)

route.post("/comment-tweet/:tweet_id", authMiddleware, commentController.commentOnTweet)

route.delete("/delete-comment-tweet/:tweet_id/:comment_id", authMiddleware, commentController.deleteTweetComment)

route.get("/get-comments-tweet/:tweet_id", authMiddleware, tweetController.getCommentstweet)


module.exports = route