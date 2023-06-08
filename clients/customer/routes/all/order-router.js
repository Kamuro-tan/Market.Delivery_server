const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authMiddleware = require('../../../../middlewares/auth-middleware')
const orderController = require('../../controllers/order-controller')


router.get('/info',     authMiddleware.strictAuth('customer'),  orderController.getPlacedOrderInfo)

router.get('/history',  authMiddleware.strictAuth('customer'),  orderController.getPlacedOrderList)

router.get('/products',  authMiddleware.strictAuth('customer'),  orderController.getPlacedOrderProductList)


module.exports = router
