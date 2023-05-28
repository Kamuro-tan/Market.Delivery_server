const {validationResult} = require('express-validator')

const OrderService = require('../services/order-service')



class OrderController {

    async getPlacedOrderInfo(req, res, next) {
        try {
            const {ID} = req.query

            const placed_order = await OrderService.getPlacedOrderInfo(ID)


            return res.json(placed_order)

        } catch(e) {
            return next(e)
        }
    }


    async getPlacedOrderList(req, res, next) {
        try {
            const user = req.user

            const placed_order_list = await OrderService.getPlacedOrderList(user)


            return res.json(placed_order_list)

        } catch(e) {
            return next(e)
        }
    }


    async getPlacedOrderProductList(req, res, next) {
        try {
            const {ID} = req.query
            const user = req.user

            const product_list = await OrderService.getPlacedOrderProductList(user, ID)


            return res.json(product_list)

        } catch(e) {
            return next(e)
        }
    }

}





module.exports = new OrderController()
