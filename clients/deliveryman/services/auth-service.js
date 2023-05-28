const ApiError = require('../../../errors/api-error')
const {Employee, EmployeeAccount} = require('../../../models/models')
const PhoneVerifyService = require('../../../services/phone-verifiy-service')
const UserTokenService = require('../../../services/user-token-service')



class AuthService {

    async login(username, session_token, security_code) {

        const employeeAccount = await EmployeeAccount.findOne({where: {username}})

        if (!employeeAccount) {
            throw ApiError.BadRequest("Unknown username.")
        }

        const employee = await Employee.findOne({where: {ID: employeeAccount.employee_ID}})

        const verify = await PhoneVerifyService.verify(employee.phone, session_token, security_code)

        const user_token = await UserTokenService.generateUserToken(employee.ID, 'deliveryman')

        return user_token
    }


    async loginPhaseOne(username, password) {

        const employeeAccount = await EmployeeAccount.findOne({where: {username}})

        if (!employeeAccount) {
            throw ApiError.BadRequest("Unknown username.")
        }

        if (employeeAccount.password != password) {
            throw ApiError.BadRequest("Incorrect password.")
        }

        const employee = await Employee.findOne({where: {ID: employeeAccount.employee_ID}})

        const session_token = await PhoneVerifyService.generatePhoneVerify(employee.phone)
        return session_token
    }


}



module.exports = new AuthService()
