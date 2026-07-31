const express = require("express")
const userControllers = require("../controllers/user.contollers.js")
const route = express.Router()

route.post("/register", userControllers.register)


module.exports = route