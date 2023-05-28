const sequelize = require('sequelize')
const crypto = require('crypto')

const {PhoneVerify} = require('../models/models')
const ApiError = require('../errors/api-error')



class PhoneVerifyService {
    security_code_length = 4
    session_token_life = 5


    generateSessionToken() {
        const session_token = crypto.randomBytes(32).toString('base64')

        return session_token
    }

    generateSecurityCode() {
        const digits = "0123456789"
        let security_code = ""

        for (let i = 0; i < this.security_code_length; i++) {
            security_code += digits[Math.floor(Math.random() * 10)]
        }

        return security_code
    }

    sendSMS(phone, security_code) {
        console.log("Security code for phone-number _%s_ is: { %s }.", phone, security_code)
    }



    async verify(phone, session_token, security_code) {
        const existingPhoneVerify = await PhoneVerify.findOne({where: {phone}})

        if (!existingPhoneVerify) {
            throw ApiError.Internal("Security code doesn't exist.")
        }

        if (session_token != existingPhoneVerify.session_token) {
            throw ApiError.BadRequest("Incorrect session token.")
        }

        if (security_code != existingPhoneVerify.security_code) {
            throw ApiError.BadRequest("Incorrect security code.")
        }

        let current_time = new Date()

        let border_time = existingPhoneVerify.created_at
        border_time.setMinutes(border_time.getMinutes() + this.session_token_life)

        if (current_time > border_time) {
            throw ApiError.BadRequest("Security code is not valid (out of date).")
        }

        if (existingPhoneVerify.is_verified) {
            throw ApiError.BadRequest("User already registered.")
        }


        await existingPhoneVerify.update({
            is_verified: true,
        })
    }


    async generatePhoneVerify(phone) {
        const existingPhoneVerify = await PhoneVerify.findOne({where: {phone}})

        const session_token = this.generateSessionToken()
        const security_code = this.generateSecurityCode()

        if (existingPhoneVerify) {
            await existingPhoneVerify.update({
                session_token: session_token,
                security_code: security_code,
                created_at: sequelize.literal('CURRENT_TIMESTAMP'),
                is_verified: false,
            })

        }
        else {
            await PhoneVerify.create({
                phone: phone,
                session_token: session_token,
                security_code: security_code,
            })

        }

        this.sendSMS(phone, security_code)

        return session_token
    }


}

module.exports = new PhoneVerifyService()
