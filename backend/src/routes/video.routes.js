const express = require("express")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddleware = require("../middlewares/user.middleware.js")
const videoControllers = require("../controllers/video.controller.js")
const commentController = require("../controllers/comment.controller.js")


//video manipulation 
route.post("/create-video", authMiddleware, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), videoControllers.createVideo)

route.delete("/delete-video/:videoId", authMiddleware, videoControllers.deleteVideo)

route.patch("/update-video/:videoId", authMiddleware, videoControllers.updateVideoDetails)



//video fetch
route.get("/get-user-videos/:username", authMiddleware, videoControllers.getUserChannelVideos)

route.get("/get-feed-videos", videoControllers.getFeedVideos)

route.get("/get-liked-videos", authMiddleware, videoControllers.getLikedVideos)

route.post("/search-video-name", authMiddleware, videoControllers.getVideoNamesOnSearch)

route.post("/search-video/:title", authMiddleware, videoControllers.searchVideosOnFeed)

route.get("/get-video/:video_id", authMiddleware, videoControllers.getVideo)

route.get("/get-watched-videos", authMiddleware, videoControllers.getwatchedVideos)

//watch video
route.get("/watch-video/:video_id", authMiddleware, videoControllers.watchVideo)



//comment
route.post("/comment-video/:video_id", authMiddleware, commentController.commentOnVideo)

route.delete("/delete-comment-video/:video_id/:comment_id", authMiddleware, commentController.deleteVideoComment)

route.get("/get-comments-video/:video_id", authMiddleware, videoControllers.getCommentsVideo)

//dislike video
route.get("/dislike-video-toggle/:video_id", authMiddleware, videoControllers.dislikeVideoToggle)//due



//due
//admin page
route.get("/publish-toggle-video/:video_id", authMiddleware, videoControllers.publishVideoToggle)

//get all admin videos 
route.get("/get-admin-videos", authMiddleware, videoControllers.getAllAdminVideos )

//get admin statistics
route.get("/get-admin-stats", authMiddleware, videoControllers.getAdminStats )

module.exports = route