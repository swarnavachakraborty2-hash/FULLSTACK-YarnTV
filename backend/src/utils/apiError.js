class apiError extends Error {
    constructor(statusCode, message = "something went wrong", errors = []) {
        super(message)//used from nodeJS's Error class
        this.statusCode = statusCode
        this.data = null
        this.success = false
        this.errors = errors
    }
}


module.exports = apiError
