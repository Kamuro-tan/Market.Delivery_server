const Router = require('express')
const {check} = require('express-validator')
const router = new Router()

const authMiddleware = require('../../../../middlewares/auth-middleware')
const productController = require('../../controllers/product-controller')


router.get('/category_list',    productController.getCategoryList)

router.get('/category',         authMiddleware.softAuth('customer'),    productController.getCategory)

router.get('/type',             authMiddleware.softAuth('customer'),    productController.getType)

router.get('/product',          authMiddleware.softAuth('customer'),    productController.getProduct)

router.get('/search_product',   authMiddleware.softAuth('customer'),    productController.searchProduct)


router.get('/favorite',         authMiddleware.strictAuth('customer'),  productController.getFavorite)

router.get('/add_favorite',     authMiddleware.strictAuth('customer'),  productController.addFavorite)

router.get('/remove_favorite',  authMiddleware.strictAuth('customer'),  productController.removeFavorite)


module.exports = router
