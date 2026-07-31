const express = require("express")
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()


//middlewares
                    /*max req.body size*/
app.use(express.json({limit: '100kb'}))//accept data in json format 
app.use(express.urlencoded())//accept data from urls
app.use(cookieParser())//allows storing and accessing cookies from user browser 
app.use(cors({ 
 origin: process.env.CORS_ORIGIN,
 credentials: true
})) 



//routes
const userRoutes = require("./routes/user.routes.js")

app.use("/api/v1/user", userRoutes)





module.exports = app