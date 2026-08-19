const express = require("express")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddleware = require("../middlewares/user.middleware.js")
const videoControllers = require("../controllers/video.controller.js")

route.post("/create-video", upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), authMiddleware, videoControllers.createVideo)

route.delete("/delete-video/:videoId", authMiddleware, videoControllers.deleteVideo)

route.patch("/update-video/:videoId", authMiddleware, videoControllers.updateVideoDetails)

route.get("/get-user-videos/:username", authMiddleware, videoControllers.getUserChannelVideos)

route.get("/get-feed-videos", authMiddleware, videoControllers.getFeedVideos)

route.get("/watch-video/:video_id", authMiddleware, videoControllers.watchVideo)

route.get("/like-video/:video_id", authMiddleware, videoControllers.likeVideo)

module.exports = route