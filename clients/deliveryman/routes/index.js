const Router = require('express')
const router = new Router()

const authRouter = require('./all/auth-router')
const userRouter = require('./all/user-router')
const orderRouter = require('./all/order-router')


router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/order', orderRouter)




module.exports = router
