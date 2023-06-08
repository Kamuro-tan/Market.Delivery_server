const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authController = require('../../controllers/auth-controller')


router.post('/registrationOTP',
[
    check('name',               "Field {name} have invalid value!").notEmpty(),
    check('surname',            "Field {surname} have invalid value!").notEmpty(),
    check('born_date',          "Field {born_date} have invalid value!").isDate(),
    check('phone',              "Field {phone} have invalid value!").isMobilePhone(),
    check('email',              "Field {email} have invalid value!").isEmail(),
],
authController.registrationOTP)

router.post('/loginOTP',
[
    check('phone',              "Field {phone} have invalid value!").isMobilePhone(),
],
authController.loginOTP)

router.post('/registration',
[
    check('name',               "Field {name} have invalid value!").notEmpty(),
    check('surname',            "Field {surname} have invalid value!").notEmpty(),
    check('born_date',          "Field {born_date} have invalid value!").isDate(),
    check('phone',              "Field {phone} have invalid value!").isMobilePhone(),
    check('email',              "Field {email} have invalid value!").isEmail(),
    check('session_token',      "Field {session_token} have invalid value!").notEmpty(),
    check('security_code',      "Field {security_code} have invalid value!").notEmpty(),
],
authController.registration)

router.post('/login',
[
    check('phone',              "Field {phone} have invalid value!").isMobilePhone(),
    check('session_token',      "Field {session_token} have invalid value!").notEmpty(),
    check('security_code',      "Field {security_code} have invalid value!").notEmpty(),
],
authController.login)


module.exports = router
