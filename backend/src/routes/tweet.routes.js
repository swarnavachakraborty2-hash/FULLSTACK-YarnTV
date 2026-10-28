const express = require("express")
const route = express.Router()
const authMiddlewares = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")
const tweetController = require("../controllers/tweet.controller.js")


route.post("/create-tweet", authMiddlewares.requiredMiddleware, tweetController.createTweet)

route.delete("/delete-tweet/:tweet_id", authMiddlewares.requiredMiddleware, tweetController.deleteTweet)

route.get("/get-feed-tweets", authMiddlewares.requiredMiddleware, tweetController.getfeedTweets)

route.get("/get-user-tweets/:user_id", authMiddlewares.requiredMiddleware, tweetController.getUserTweets)

route.post("/comment-tweet/:tweet_id", authMiddlewares.requiredMiddleware, commentController.commentOnTweet)

route.delete("/delete-comment-tweet/:tweet_id/:comment_id", authMiddlewares.requiredMiddleware, commentController.deleteTweetComment)

route.get("/get-comments-tweet/:tweet_id", authMiddlewares.requiredMiddleware, tweetController.getCommentstweet)

route.get("/dislike-tweet-toggle/:tweet_id", authMiddlewares.requiredMiddleware, tweetController.dislikeTweetToggle)//due


module.exports = route
