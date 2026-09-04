const express = require("express")
const route = express.Router()
const authMiddleware = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")
const tweetController = require("../controllers/tweet.controller.js")


route.post("/create-new-playlist/video_id", authMiddleware)

route.patch("/update-playlist-details/:playlist_id", authMiddleware)

route.delete("/delete-playlist/:playlist_id", authMiddleware)

route.post("/save-video-playlist/:playlist_id/:video_id", authMiddleware)

route.post("/delete-video-playlist/:playlist_id/:video_id", authMiddleware)

route.post("/get-user-playlists/:user_id", authMiddleware)

route.post("/get-currentUser-playlists-options/:username", authMiddleware)


module.exports = route