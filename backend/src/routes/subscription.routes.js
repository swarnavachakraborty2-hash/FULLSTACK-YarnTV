const express = require('express')
const authMiddleware = require("../middlewares/user.middleware.js")
const subscriptionControllers = require("../controllers/subscription.controller.js")
const route = express.Router()

route.get("/get-subscribed-to-users", authMiddleware, subscriptionControllers.getSubscribedToUsers )
route.get("/:username", authMiddleware, subscriptionControllers.userSubscription )

module.exports = route
