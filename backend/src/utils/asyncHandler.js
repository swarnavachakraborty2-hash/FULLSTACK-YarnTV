//this is a general function that will be applied in every other controllers 
//wraps every controller in a try/catch


/*pass a function as a param*/
const asyncHandler = (fn) => async ( req, res, next) => { // we can access the parameters of the function that is passed as a parameter
    try {

        await fn(req, res, next) // calls the function here

    } catch (error) {

        console.log(error)
        return res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}



module.exports = asyncHandler




