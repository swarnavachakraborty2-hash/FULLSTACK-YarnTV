class apiResponse {
    constructor(statusCode, message = "success", data){
        this.message = message
        this.statusCode = statusCode
        this.data = data
        this.success = true
    }
}


module.exports = apiResponse



