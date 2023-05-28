const ApiError = require('../errors/api-error')
const UserTokenService = require('../services/user-token-service')

function strictAuth (user_type) {
    return async function (req, res, next) {

        if (req.method === 'OPTIONS') {
            next()
        }


        try {

            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                return next(ApiError.UnauthorizedError())
            }

            const token = authorizationHeader.split(" ")[1]
            if (!token) {
                return next(ApiError.UnauthorizedError())
            }

            const userData = await UserTokenService.validateUserTokenAs(token, user_type)
            if (!userData) {
                return next(ApiError.UnauthorizedError())
            }


            req.user = userData.dataValues
            next()

        } catch(e) {

            return next(ApiError.UnauthorizedError())
        }

    }
}


function softAuth (user_type) {
    return async function (req, res, next) {

        if (req.method === 'OPTIONS') {
            next()
        }


        try {

            req.user = null

            const authorizationHeader = req.headers.authorization
            if (!authorizationHeader) {
                return next()
            }

            const token = authorizationHeader.split(" ")[1]
            if (!token) {
                return next()
            }

            const userData = await UserTokenService.validateUserTokenAs(token, user_type)
            if (!userData) {
                return next()
            }


            req.user = userData.dataValues
            next()

        } catch(e) {

            return next()
        }

    }
}





module.exports = {
    strictAuth,
    softAuth,
}
