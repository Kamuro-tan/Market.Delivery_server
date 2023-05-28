const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authMiddleware = require('../../../../middlewares/auth-middleware')
const orderController = require('../../controllers/order-controller')



router.get('/get',              authMiddleware.strictAuth('deliveryman'),   orderController.get)

router.get('/collected',        authMiddleware.strictAuth('deliveryman'),   orderController.orderCollected)

router.get('/completed',        authMiddleware.strictAuth('deliveryman'),   orderController.orderCompleted)



router.post('/products',        authMiddleware.strictAuth('deliveryman'),   orderController.getOrderProductList)

router.get('/product',          authMiddleware.strictAuth('deliveryman'),   orderController.getOrderProduct)





module.exports = router
