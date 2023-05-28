const {validationResult} = require('express-validator')

const ApiError = require('../../../errors/api-error')
const OrderService = require('../services/order-service')



class OrderController {

    async get(req, res, next) {
        try {
            const user = req.user

            const order = await OrderService.get(user)


            return res.json(order)

        } catch(e) {
            return next(e)
        }
    }


    async orderCollected(req, res, next) {
        try {
            const {ID} = req.query

            const order = await OrderService.orderCollected(ID)


            return res.json({message: "Order have been packed."})

        } catch(e) {
            return next(e)
        }
    }


    async orderCompleted(req, res, next) {
        try {
            const {ID} = req.query

            const order = await OrderService.orderCompleted(ID)


            return res.json({message: "Order have been finished."})

        } catch(e) {
            return next(e)
        }
    }


    async getOrderProductList(req, res, next) {
        try {
            const ID_array = req.body

            const product_list = await OrderService.getOrderProductList(ID_array)


            return res.json(product_list)

        } catch(e) {
            return next(e)
        }
    }


    async getOrderProduct(req, res, next) {
        try {
            const {ID} = req.query

            const product = await OrderService.getOrderProduct(ID)


            return res.json(product)

        } catch(e) {
            return next(e)
        }
    }

}




module.exports = new OrderController()
