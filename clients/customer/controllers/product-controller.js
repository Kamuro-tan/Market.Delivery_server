const {validationResult} = require('express-validator')

const ProductService = require('../services/product-service')



class AuthController {

    async getCategoryList(req, res, next) {
        try {

            const category_list = await ProductService.getCategoryList()


            return res.json(category_list)

        } catch(e) {
            return next(e)
        }
    }


    async getCategory(req, res, next) {
        try {
            const {ID} = req.query
            const user = req.user

            const type_list = await ProductService.getCategoryByID(user, ID)


            return res.json(type_list)

        } catch(e) {
            return next(e)
        }
    }


    async getType(req, res, next) {
        try {
            const {ID} = req.query
            const user = req.user

            const type_products = await ProductService.getTypeByID(user, ID)


            return res.json(type_products)

        } catch(e) {
            return next(e)
        }
    }


    async getProduct(req, res, next) {
        try {
            const {ID} = req.query
            const user = req.user

            const product = await ProductService.getProductByID(user, ID)


            return res.json(product)

        } catch(e) {
            return next(e)
        }
    }


    async searchProduct(req, res, next) {
        try {
            const {input} = req.query
            const user = req.user

            const product_list = await ProductService.searchProductByName(user, input)


            return res.json(product_list)

        } catch(e) {
            return next(e)
        }
    }


    async getFavorite(req, res, next) {
        try {
            const user = req.user

            const product_list = await ProductService.getFavoriteList(user)


            return res.json(product_list)

        } catch(e) {
            return next(e)
        }
    }


    async addFavorite(req, res, next) {
        try {
            const {ID} = req.query
            const user = req.user

            const favorite = await ProductService.addToFavorite(user, ID)


            return res.json({message: "Product have been added to favorite."})

        } catch(e) {
            return next(e)
        }
    }


    async removeFavorite(req, res, next) {
        try {
            const {ID} = req.query
            const user = req.user

            const favorite = await ProductService.removeFromFavorite(user, ID)


            return res.json({message: "Product have been removed from favorite."})

        } catch(e) {
            return next(e)
        }
    }



}


module.exports = new AuthController()
