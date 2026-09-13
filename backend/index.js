require("dotenv").config()
const app = require("./src/app.js")
const connectDB = require("./src/db/db.js")


connectDB()// return a promise since we used async await in db function 
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is running at port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("db connection failed: ", err)
    })