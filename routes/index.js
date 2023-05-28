const Router = require('express')
const router = new Router()
const customerRouter = require('../clients/customer/routes/index')
const deliverymanRouter = require('../clients/deliveryman/routes/index')



router.use('/customer', customerRouter)
router.use('/deliveryman', deliverymanRouter)

module.exports = router
