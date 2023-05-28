const {validationResult} = require('express-validator')

const ApiError = require('../../../errors/api-error')
const AuthService = require('../services/auth-service')



class AuthController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {name, surname, middle_name, born_date, phone, email, session_token, security_code} = req.body


            await AuthService.registration(name, surname, middle_name, born_date, phone, email, session_token, security_code)

            return res.json({message: "User created."})

        } catch(e) {
            return next(e)
        }
    }


    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {phone, session_token, security_code} = req.body


            const token = await AuthService.login(phone, session_token, security_code)

            return res.json({token})

        } catch(e) {
            return next(e)
        }
    }



    async registrationOTP(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {phone, email} = req.body


            const session_token = await AuthService.registrationOTP(phone, email)

            return res.json({session_token})

        } catch(e) {
            return next(e)
        }
    }

    async loginOTP(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {phone} = req.body


            const session_token = await AuthService.loginOTP(phone)

            return res.json({session_token})

        } catch(e) {
            return next(e)
        }
    }


}




module.exports = new AuthController()
