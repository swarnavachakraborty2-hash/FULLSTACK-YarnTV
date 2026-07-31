const asyncHandler = require("../utils/asyncHandler.js")

/*stores the response */      /*this funtion is passed as a parameter*/
const register = asyncHandler(async function (req, res) {

    return res.status(200).json({
        message: "ok"
    })

})

module.exports = { register }

