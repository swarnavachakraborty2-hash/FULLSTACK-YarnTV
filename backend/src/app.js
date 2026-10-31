const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()


//middlewares
/*max req.body size*/
app.use(express.json({ limit: '16kb' }))//accept data in json format 
app.use(express.urlencoded({ extended: true, limit: '16kb' }))//accept data from urls
app.use(cookieParser())//allows storing and accessing cookies from user browser 
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.CORS_ORIGIN?.replace(/\/$/, ""),
    "https://fullstack-yarn-tv.vercel.app",
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.some(o => o && o.replace(/\/$/, "") === cleanOrigin)) {
            return callback(null, true);
        }
        return callback(null, cleanOrigin);
    },
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