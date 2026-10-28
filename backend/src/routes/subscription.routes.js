const express = require('express')
const authMiddlewares = require("../middlewares/user.middleware.js")
const subscriptionControllers = require("../controllers/subscription.controller.js")
const route = express.Router()

route.get("/get-subscribed-to-users", authMiddlewares.requiredMiddleware, subscriptionControllers.getSubscribedToUsers )
route.get("/:username", authMiddlewares.requiredMiddleware, subscriptionControllers.userSubscription )

module.exports = route
