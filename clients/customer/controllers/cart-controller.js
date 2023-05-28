const {validationResult} = require('express-validator')

const CartService = require('../services/cart-service')



class CartController {

    async getCartProductList(req, res, next) {
        try {
            const ID_array = req.body
            const user = req.user

            const product_list = await CartService.getCartProductList(user, ID_array)


            return res.json(product_list)

        } catch(e) {
            return next(e)
        }
    }


    async getOrderInfo(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const order_params = req.body

            const info = await CartService.getOrderInfo(order_params)


            return res.json({duration: info[0], order_price: info[1]})

        } catch(e) {
            return next(e)
        }
    }


    async placeOrder(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("Validation error.", errors.array())
            }

            const order_params = req.body
            const user = req.user

            const order_ID = await CartService.placeOrder(user, order_params)


            return res.json(order_ID)

        } catch(e) {
            return next(e)
        }
    }

}





module.exports = new CartController()
