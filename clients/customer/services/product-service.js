const {Op, Sequelize} = require('sequelize');

const ApiError = require('../../../errors/api-error')
const {Category, Type, Product, Favorite} = require('../../../models/models')



class ProductService {

    async getCategoryList() {

        const category_list = await Category.findAll({
            attributes: {
                include: [[Sequelize.fn("COUNT", "main_product.ID"), "products_amount"]],
                exclude: ['category_ID'],
            },
            include: [{
                model: Type,
                attributes: [],
                required: true,
                include: [{
                    model: Product,
                    attributes: [],
                    required: true,
                }],
            }],
            group: ['main_product_category.ID'],
            order: ['ID'],
        })

        return category_list
    }


    async getCategoryByID(user, ID) {
        const category_ID = ID
        var type_list

        if (user) {
            const customer_ID = user.user_ID

            type_list = await Type.findAll({
                attributes: {
                    include: [[Sequelize.literal('(select count(*) from "main_product" join "main_product_type" as T on "main_product"."type_ID" = T."ID" where T."ID" = "main_product_type"."ID")'), 'products_amount']],
                    exclude: ['category_ID'],
                },
                group: ['main_product_type.ID'],
                include: [{
                    model: Product,
                    attributes: {
                        include: [[Sequelize.literal('exists(select * from "main_customer_favorite" as F where F."product_ID" = "main_product"."ID" and F."customer_ID" = ' + customer_ID + ')'), 'favorite']],
                        exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                    },
                    limit: 5,
                }],
                where: {category_ID},
            })

        } else {

            type_list = await Type.findAll({
                attributes: {
                    include: [[Sequelize.literal('(select count(*) from "main_product" join "main_product_type" as T on "main_product"."type_ID" = T."ID" where T."ID" = "main_product_type"."ID")'), 'products_amount']],
                    exclude: ['category_ID'],
                },
                group: ['main_product_type.ID'],
                include: [{
                    model: Product,
                    attributes: {
                        exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                    },
                    limit: 5,
                }],
                where: {category_ID},
            })
        }

        return type_list
    }


    async getTypeByID(user, ID) {
        const type_ID = ID
        var type_products


        if (user) {
            const customer_ID = user.user_ID

            type_products = await Product.findAll({
                attributes: {
                    include: [[Sequelize.literal('exists(select * from "main_customer_favorite" as F where F."product_ID" = "main_product"."ID" and F."customer_ID" = ' + customer_ID + ')'), 'favorite']],
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
                where: {type_ID},
            })

        } else {

            type_products = await Product.findAll({
                attributes: {
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
                where: {type_ID},
            })
            // .then((objs) => {
            //     objs.forEach((obj) => {
            //         // console.log(obj.getDataValue('ID'))
            //         // obj.setDataValue('image', obj.getDataValue('new_product.png'))
            //         obj.setDataValue('image', 'new_product.png')
            //     })

            //     return objs
            // })
        }

        return type_products
    }


    async getProductByID(user, ID) {
        var product


        if (user) {
            const customer_ID = user.user_ID

            product = await Product.findOne({
                attributes: {
                    include: [[Sequelize.literal('exists(select * from "main_customer_favorite" as F where F."product_ID" = ' + ID + ' and F."customer_ID" = ' + customer_ID + ')'), 'favorite']],
                    exclude: ['cost', 'type_ID'],
                },
                where: {ID},
            })

        } else {

            product = await Product.findOne({
                attributes: {
                    exclude: ['cost', 'type_ID'],
                },
                where: {ID},
            })
        }

        return product
    }


    async searchProductByName(user, input) {
        var product_list


        if (user) {
            const customer_ID = user.user_ID

            product_list = await Product.findAll({
                attributes: {
                    include: [[Sequelize.literal('exists(select * from "main_customer_favorite" as F where F."product_ID" = "main_product"."ID"  and F."customer_ID" = ' + customer_ID + ')'), 'favorite']],
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
                where: {name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + input + '%')},
            })

        } else {

            product_list = await Product.findAll({
                attributes: {
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
                where: {name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + input + '%')},
            })
        }

        return product_list
    }


    async getFavoriteList(user) {
        const customer_ID = user.user_ID


        const favorite_list = await Product.findAll({
            attributes: {
                include: [[Sequelize.literal('true'), 'favorite']],
                exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
            },
            include: [{
                model: Favorite,
                attributes: [],
                where: {customer_ID},
                right: true
            }],
        })

        return favorite_list
    }


    async addToFavorite(user, ID) {
        const customer_ID = user.user_ID
        const product_ID = ID
        var favorite

        favorite = await Favorite.findOne({
            where: {customer_ID, product_ID},
        })

        if (favorite) {
            throw ApiError.BadRequest("Product already in favorite.")
        }

        favorite = await Favorite.create({customer_ID, product_ID})

        return favorite
    }


    async removeFromFavorite(user, ID) {
        const customer_ID = user.user_ID
        const product_ID = ID

        const favorite = await Favorite.destroy({
            where: {customer_ID, product_ID},
        })

        return favorite
    }





}



module.exports = new ProductService()
