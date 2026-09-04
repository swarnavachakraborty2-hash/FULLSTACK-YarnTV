const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()


//middlewares
/*max req.body size*/
app.use(express.json({ limit: '100kb' }))//accept data in json format 
app.use(express.urlencoded())//accept data from urls
app.use(cookieParser())//allows storing and accessing cookies from user browser 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



//routes
const userRoutes = require("./routes/user.routes.js")
const subscriptionRoutes = require("./routes/subscription.routes.js")
const videoRoutes = require("./routes/video.routes.js")
const tweetRoutes = require("./routes/tweet.routes.js")
const likeRoutes = require("./routes/like.route.js")
const playlistRoutes = require("./routes/playlist.routes.js")

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/subscription", subscriptionRoutes)
app.use("/api/v1/video", videoRoutes)
app.use("/api/v1/tweet", tweetRoutes)
app.use("/api/v1/like", likeRoutes)
app.use("/api/v1/playlist", playlistRoutes)


module.exports = app