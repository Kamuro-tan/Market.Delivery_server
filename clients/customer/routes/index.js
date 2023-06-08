const Router = require('express')
const router = new Router()

const authRouter = require('./all/auth-router')
const userRouter = require('./all/user-router')
const productRouter = require('./all/product-router')
const cartRouter = require('./all/cart-router')
const orderRouter = require('./all/order-router')


router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/', productRouter)
router.use('/cart', cartRouter)
router.use('/order/placed', orderRouter)


module.exports = router
