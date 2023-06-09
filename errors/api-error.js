module.exports = class ApiError extends Error {

    constructor(status, message, errors) {
        super(message)

        this.status = status
        this.errors = errors
    }


    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static Forbidden(message, errors = []) {
        return new ApiError(403, message)
    }

    static NotFound(message, errors = []) {
        return new ApiError(404, message)
    }

    static Internal(message, errors = []) {
        return new ApiError(500, message)
    }


    static UnauthorizedError() {
        return new ApiError(401, "User is not logged in.")
    }

}
