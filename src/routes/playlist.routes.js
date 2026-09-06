const express = require("express")
const route = express.Router()
const authMiddleware = require("../middlewares/user.middleware.js")
const commentController = require("../controllers/comment.controller.js")
const tweetController = require("../controllers/tweet.controller.js")
const playlistController = require("../controllers/playlist.controller.js")


route.post("/create-new-playlist/:video_id", authMiddleware, playlistController.createPlaylist)

route.patch("/update-playlist-details/:playlist_id", authMiddleware, playlistController.updateDetails)

route.delete("/delete-playlist/:playlist_id", authMiddleware, playlistController.deletePlaylist)

route.get("/save-video-playlist/:playlist_id/:video_id", authMiddleware, playlistController.saveVideoToPlaylist)

route.delete("/delete-video-playlist/:playlist_id/:video_id", authMiddleware, playlistController.deleteVideoFromPlaylist)

route.get("/get-user-playlists/:user_id", authMiddleware, playlistController.getUserChannelPlaylists)

route.get("/get-currentUser-playlists-options/:user_id", authMiddleware, playlistController.getUserPlaylistOptions)

route.get("/get-playlist-videos/:playlist_id", authMiddleware, playlistController.getPlaylistVideos)



module.exports = route