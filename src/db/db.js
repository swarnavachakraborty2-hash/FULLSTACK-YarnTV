const mongoose = require('mongoose')

async function connectDB() {
    try {

        await mongoose.connect(process.env.DATABASE_URI)

        console.log("DB is connected ")
        
    } catch (error) {
        
        console.log(error)

        throw error

    }
}

module.exports = connectDB