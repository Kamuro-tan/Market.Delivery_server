const jwt = require('jsonwebtoken')

const {UserToken} = require('../models/models')



class UserTokenService {

    generateToken(payload) {
        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET)

        return token
    }


    async generateUserToken(user_ID, user_type) {
        const userToken = await UserToken.findOne({where: {user_ID, user_type}})

        const token = this.generateToken({user_ID, user_type})

        if (userToken) {
            await userToken.update({token})

        } else {
            await UserToken.create({user_ID, user_type, token})

        }

        return token
    }


    async removeUserToken(token) {
        const userToken = await UserToken.destroy({where: {token}})
        return userToken
    }


    async validateUserTokenAs(token, user_type) {
        const userToken = await UserToken.findOne({where: {token, user_type}})
        return userToken
    }


}



module.exports = new UserTokenService()
