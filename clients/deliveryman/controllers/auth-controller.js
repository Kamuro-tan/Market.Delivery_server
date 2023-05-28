const {validationResult} = require('express-validator')

const ApiError = require('../../../errors/api-error')
const AuthService = require('../services/auth-service')



class AuthController {

    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {username, session_token, security_code} = req.body

            const token = await AuthService.login(username, session_token, security_code)

            return res.json({token})

        } catch(e) {
            return next(e)
        }
    }


    async loginPhaseOne(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {username, password} = req.body


            const session_token = await AuthService.loginPhaseOne(username, password)

            return res.json({session_token})

        } catch(e) {
            return next(e)
        }
    }


}




module.exports = new AuthController()
