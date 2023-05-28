const Router = require('express')
const {check} = require('express-validator')
const router = new Router()


const authMiddleware = require('../../../../middlewares/auth-middleware')
const authController = require('../../controllers/auth-controller')



router.post('/login/first',
[
    check('username',           "Field {username} have invalid value!").notEmpty(),
    check('password',           "Field {password} have invalid value!").notEmpty(),
],
authController.loginPhaseOne)


router.post('/login',
[
    check('username',           "Field {username} have invalid value!").notEmpty(),
    check('session_token',      "Field {session_token} have invalid value!").notEmpty(),
    check('security_code',      "Field {security_code} have invalid value!").notEmpty(),
],
authController.login)





module.exports = router
