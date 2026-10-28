const express = require("express")
const route = express.Router()
const upload = require("../middlewares/multer.middleware.js")
const authMiddlewares = require("../middlewares/user.middleware.js")
const videoControllers = require("../controllers/video.controller.js")
const commentController = require("../controllers/comment.controller.js")


//video manipulation 
route.post("/create-video", authMiddlewares.requiredMiddleware, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), videoControllers.createVideo)

route.delete("/delete-video/:videoId", authMiddlewares.requiredMiddleware, videoControllers.deleteVideo)

route.patch("/update-video/:videoId", authMiddlewares.requiredMiddleware, videoControllers.updateVideoDetails)



//video fetch
route.get("/get-user-videos/:username", authMiddlewares.requiredMiddleware, videoControllers.getUserChannelVideos)

route.get("/get-feed-videos", videoControllers.getFeedVideos)//guest can also perform

route.get("/get-liked-videos", authMiddlewares.requiredMiddleware, videoControllers.getLikedVideos)

//video suggestions
route.post("/search-video-name", authMiddlewares.optionalMiddleware, videoControllers.getVideoNamesOnSearch)//guest can also perform

route.post("/search-video/:title", authMiddlewares.optionalMiddleware, videoControllers.searchVideosOnFeed)//guest can also perform

route.get("/get-video/:video_id", authMiddlewares.optionalMiddleware, videoControllers.getVideo)

route.get("/get-watched-videos", authMiddlewares.requiredMiddleware, videoControllers.getwatchedVideos)

//watch video
route.get("/watch-video/:video_id", authMiddlewares.optionalMiddleware, videoControllers.watchVideo)



//comment
route.post("/comment-video/:video_id", authMiddlewares.requiredMiddleware, commentController.commentOnVideo)

route.delete("/delete-comment-video/:video_id/:comment_id", authMiddlewares.requiredMiddleware, commentController.deleteVideoComment)

route.get("/get-comments-video/:video_id", authMiddlewares.optionalMiddleware, videoControllers.getCommentsVideo)

//dislike video
route.get("/dislike-video-toggle/:video_id", authMiddlewares.requiredMiddleware, videoControllers.dislikeVideoToggle)//due



//due
//admin page
route.get("/publish-toggle-video/:video_id", authMiddlewares.requiredMiddleware, videoControllers.publishVideoToggle)

//get all admin videos 
route.get("/get-admin-videos", authMiddlewares.requiredMiddleware, videoControllers.getAllAdminVideos )

//get admin statistics
route.get("/get-admin-stats", authMiddlewares.requiredMiddleware, videoControllers.getAdminStats )

module.exports = route
