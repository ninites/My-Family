class ApiError {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    static isMissing(msg) {
        return new ApiError(404, msg)
    }

    static emptyBody(msg) {
        return new ApiError(415, msg)
    }

    static notLogged(msg) {
        return new ApiError(401, msg)
    }

    static mysql(msg) {
        return new ApiError(500, msg)
    }

}

module.exports = ApiError