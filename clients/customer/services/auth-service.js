const ApiError = require('../../../errors/api-error')
const {Customer, CustomerAccount} = require('../../../models/models')
const PhoneVerifyService = require('../../../services/phone-verifiy-service')
const UserTokenService = require('../../../services/user-token-service')



class AuthService {

    async isCustomerAccountExist(phone) {
        const existingCustomer = await Customer.findOne({where: {phone}})
        if (!existingCustomer) {
            return
        }

        const existingAccount = await CustomerAccount.findOne({where: {customer_ID: existingCustomer.ID}})
        if (!existingAccount.is_active) {
            return
        }

        return existingCustomer
    }



    async registration(name, surname, middle_name, born_date, phone, email, session_token, security_code) {

        if (await this.isCustomerAccountExist(phone)) {
            throw ApiError.BadRequest("User with that phone already exist.")
        }

        if (await Customer.findOne({where: {email}})) {
            throw ApiError.BadRequest("User with that email already exist.")
        }

        const verify = await PhoneVerifyService.verify(phone, session_token, security_code)

        const user = await Customer.create({name, surname, middle_name, born_date, phone, email})
        const account = await CustomerAccount.create({customer_ID: user.ID, rating: 0})

    }


    async login(phone, session_token, security_code) {

        const existingCustomer = await this.isCustomerAccountExist(phone)
        if (!existingCustomer) {
            throw ApiError.BadRequest("User with that phone doesn't exist.")
        }

        const verify = await PhoneVerifyService.verify(phone, session_token, security_code)

        const user_token = await UserTokenService.generateUserToken(existingCustomer.ID, 'customer')

        return user_token
    }



    async registrationOTP(phone, email) {

        if (await this.isCustomerAccountExist(phone)) {
            throw ApiError.BadRequest("User with that phone already exist.")
        }

        if (await Customer.findOne({where: {email}})) {
            throw ApiError.BadRequest("User with that email already exist.")
        }

        const session_token = await PhoneVerifyService.generatePhoneVerify(phone)
        return session_token
    }


    async loginOTP(phone) {

        if (!(await this.isCustomerAccountExist(phone))) {
            throw ApiError.BadRequest("User with that phone doesn't exist.")
        }

        const session_token = await PhoneVerifyService.generatePhoneVerify(phone)
        return session_token
    }


}


module.exports = new AuthService()
