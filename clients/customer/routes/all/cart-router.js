const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authMiddleware = require('../../../../middlewares/auth-middleware')
const cartController = require('../../controllers/cart-controller')


router.post('/',
authMiddleware.softAuth('customer'),
cartController.getCartProductList)


router.post('/order/info',
authMiddleware.softAuth('customer'),
[
    check('address',                "Field {address} have invalid value!").notEmpty(),
    check('coordinates',            "Field {coordinates} have invalid value!").notEmpty(),
    check('price',                  "Field {price} have invalid value!").notEmpty(),
    check('products_amount',           "Field {product_list} have invalid value!").notEmpty(),
    check('product_list',           "Field {product_list} have invalid value!").notEmpty(),
],
cartController.getOrderInfo)


router.post('/order/place',
authMiddleware.strictAuth('customer'),
[
    check('address',                "Field {address} have invalid value!").notEmpty(),
    check('coordinates',            "Field {coordinates} have invalid value!").notEmpty(),
    check('price',                  "Field {price} have invalid value!").notEmpty(),
    check('product_list',           "Field {product_list} have invalid value!").notEmpty(),
],
cartController.placeOrder)


module.exports = router
