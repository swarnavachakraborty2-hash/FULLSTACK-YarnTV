const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    watchHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "video"
        }
    ],
    username: {
        type: String,
        required: [true,'user must have an username'],
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    }, 
    email: {
        type: String,
        required: [true,'user must have an email'],
        lowercase: true, 
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: [true,'full name is required'],
        trim: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    password: {//hash 
        type: String,
        required: [true,'user must have a password'],
        minLength: [8,'password must be of atleast 8 characters'],
        maxLength: [20,'password must be less than 20 characters '],
        trim: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})


//.pre() performs some function before any data in the schema is "saved" in database
userSchema.pre("save", async function (next) {

    if(this.isModified("password")){ //only generate hash of password when the password field is modified.
     this.password = await bcrypt.hash(this.password, 10)
     next()//executes the next code in controllers 
    }
    else{
        return next()// return if something else is modified i.e. no need to generate hash of password again
    }
})


//method to check whether the user password is correct or not i.e matches with the hashed password in db or not 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


const userModel = mongoose.model("user", userSchema)

module.exports = userModel


