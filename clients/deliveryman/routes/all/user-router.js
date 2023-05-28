const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authMiddleware = require('../../../../middlewares/auth-middleware')
const userController = require('../../controllers/user-controller')



router.get('/profile',          authMiddleware.strictAuth('deliveryman'),  userController.profile)

router.get('/start',        authMiddleware.strictAuth('deliveryman'),  userController.start)

router.get('/finish',      authMiddleware.strictAuth('deliveryman'),  userController.finish)

router.get('/logout',           authMiddleware.strictAuth('deliveryman'),  userController.logout)




module.exports = router
