//this is a general function that will be applied in every other controllers 
//wraps every controller in a try/catch
const apiError = require('../utils/apiError')

/*pass a function as a param*/
const asyncHandler = (fn) => async (req, res, next) => { // we can access the parameters of the function that is passed as a parameter
    try {

        await fn(req, res, next) // calls the function here

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            messsage: error.message || "something went wrong"
        })
    }
}



module.exports = asyncHandler
