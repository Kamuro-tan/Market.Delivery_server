const {validationResult} = require('express-validator')

const ApiError = require('../../../errors/api-error')
const UserTokenService = require('../../../services/user-token-service')
const {Customer} = require('../../../models/models')



class UserController {

    async profile(req, res, next) {
        try {
            const {user_ID} = req.user

            const user = await Customer.findOne({where: {ID: user_ID}})


            return res.json(user)

        } catch(e) {
            return next(ApiError.BadRequest("Error in gettion user information."))
        }
    }


    async edit(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const {user_ID} = req.user
            const user = await Customer.findOne({where: {ID: user_ID}})

            const {name, surname, middle_name, born_date, phone, email} = req.body
            await user.update({name, surname, middle_name, born_date, phone, email})


            return res.json({message: "User data edited."})

        } catch(e) {
            return next(ApiError.BadRequest("Error in user data editing."))
        }
    }


    async logout(req, res, next) {
        try {
            const {token} = req.user

            const user_token = await UserTokenService.removeUserToken(token)

            return res.json({message: "Successful logout."})

        } catch(e) {
            return next(ApiError.BadRequest("Error in logout."))
        }
    }


}




module.exports = new UserController()
