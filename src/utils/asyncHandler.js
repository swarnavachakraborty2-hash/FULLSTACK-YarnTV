//this is a general function that will be applied in every other controllers 

const asyncHandler = (fn) => async (req, res, next) => {
    try {

        await fn(req, res, next) //wraps the original controller in try/catch to handle failures

    } catch (error) {

        res.status(error.code || 500).json({
            success: false,
            message: `error: ${error.message}`
        })

    }
}

module.exports = {asyncHandler}