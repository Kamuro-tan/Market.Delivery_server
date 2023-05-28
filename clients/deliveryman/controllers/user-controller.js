const ApiError = require('../../../errors/api-error')
const UserTokenService = require('../../../services/user-token-service')
const {Employee, AvailableEmployee, Store, Order} = require('../../../models/models')



class UserController {

    async profile(req, res, next) {
        try {
            const {user_ID} = req.user

            const user = await Employee.findOne({
                attributes: {
                    exclude: ['store_ID'],
                },
                include: [{
                    model: Store,
                }],
                where: {ID: user_ID}
            })


            return res.json(user)

        } catch(e) {
            return next(ApiError.BadRequest("Error in gettion user information."))
        }
    }


    async start(req, res, next) {
        try {
            const {user_ID} = req.user

            var availableUser = await AvailableEmployee.findOne({where: {employee_ID: user_ID}})

            if (!availableUser) {
                const employee = await Employee.findOne({where: {ID: user_ID}})

                availableUser = await AvailableEmployee.create({store_ID: employee.store_ID, employee_ID: user_ID})
            }


            return res.json({message: "User is ready to get order."})

        } catch(e) {
            return next(ApiError.BadRequest("Error in ready operation."))
        }
    }


    async finish(req, res, next) {
        try {
            const {user_ID} = req.user

            const order = await Order.findOne({
                where: {
                    deliveryman: user_ID,
                    current_phase: 'Picking',
                }
            })

            if (order != null) {
                throw ApiError.BadRequest("You have not completed order.")
            }

            const availableUser = await AvailableEmployee.destroy({where: {employee_ID: user_ID}})


            return res.json({message: "User unready to get order."})

        } catch(e) {
            return next(ApiError.BadRequest("Error in unready operation."))
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
