const jwt = require('jsonwebtoken')
const asyncHandler = require("../utils/asyncHandler")
const apiError = require('../utils/apiError')

const authMiddleware = asyncHandler(async (req, res, next) => {

  const token = req.cookies.AccessToken

  if(!token){
    throw new apiError(401, "unauthorised request")
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  req.user = decoded

  next()
})

module.exports = authMiddleware 