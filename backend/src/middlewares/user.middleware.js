const jwt = require('jsonwebtoken')
const asyncHandler = require("../utils/asyncHandler")
const apiError = require('../utils/apiError')

const requiredMiddleware = asyncHandler(async (req, res, next) => {

  const token = req.cookies.AccessToken

  if (!token) {
    throw new apiError(401, "unauthorised request")
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  req.user = decoded

  next()
})

const optionalMiddleware = asyncHandler(async function (req, res, next) {

  try {
    const token = req.cookies.AccessToken

    if (!token) {
      throw new apiError(401, "unauthorised request")
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    req.user = decoded
  }
  catch {
    req.user = null
  }

  next()
})

module.exports = { requiredMiddleware, optionalMiddleware}