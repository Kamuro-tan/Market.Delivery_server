const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authMiddleware = require('../../../../middlewares/auth-middleware')
const userController = require('../../controllers/user-controller')


router.get('/profile',  authMiddleware.strictAuth('customer'),  userController.profile)

router.post('/edit',
authMiddleware.strictAuth('customer'),
[
    check('name',               "Field {name} have invalid value!").notEmpty(),
    check('surname',            "Field {surname} have invalid value!").notEmpty(),
    check('middle_name',        "Field {middle_name} have invalid value!").exists(),
    check('born_date',          "Field {born_date} have invalid value!").notEmpty().isDate(),
    check('phone',              "Field {phone} have invalid value!").isMobilePhone(),
    check('email',              "Field {email} have invalid value!").isEmail(),
],
userController.edit)

router.get('/logout',  authMiddleware.strictAuth('customer'),  userController.logout)


module.exports = router
