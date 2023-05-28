const {Op, Sequelize} = require('sequelize');

const ApiError = require('../../../errors/api-error')
const {Order, Employee, Store, Product, OrderProduct} = require('../../../models/models')



class OrderService {

    async getPlacedOrderInfo(ID) {

        const order = await Order.findOne({where: {ID}})

        const deliveryman = await Employee.findOne({
            attributes: ['name', 'phone', 'store_ID'],
            where: {ID: order.deliveryman},
        })

        const store = await Store.findOne({where: {ID: deliveryman.store_ID}})

        const placed_order_info = {
            ID: order.ID,
            price: order.price,
            address: order.address,
            coordinates: order.coordinates,
            order_time: order.order_time,
            estimated_time: order.estimated_time,
            current_phase: order.current_phase,
            deliveryman: {
                name: deliveryman.name,
                phone: deliveryman.phone,
            },
            store_address: store.address,
        }

        return placed_order_info
    }


    async getPlacedOrderList(user) {
        const user_ID = user.user_ID

        const placed_order_list = await Order.findAll({
            attributes: ['ID', 'order_time', 'price', 'current_phase'],
            where: {customer: user_ID},
            order: [['ID', 'DESC']]
        })

        return placed_order_list
    }


    async getPlacedOrderProductList(user, order_ID) {
        const customer_ID = user.user_ID

        const order_product_list = await OrderProduct.findAll({
            attributes: ['product_ID', 'amount'],
            include: [{
                model: Product,
                attributes: {
                    include: [[Sequelize.literal('exists(select * from "main_customer_favorite" as F where F."product_ID" = "main_product"."ID" and F."customer_ID" = ' + customer_ID + ')'), 'favorite']],
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
            }],
            where: {order_ID},
        })
        .then((objs) => {
            var product_list = []

            objs.forEach((obj) => {
                product_list.push({
                    'ID': obj.getDataValue('product_ID'),
                    'amount': obj.getDataValue('amount'),
                    'name': obj.getDataValue('main_product').getDataValue('name'),
                    'price': obj.getDataValue('main_product').getDataValue('price'),
                    'by_weight': obj.getDataValue('main_product').getDataValue('by_weight'),
                    'weight': obj.getDataValue('main_product').getDataValue('weight'),
                    'favorite': obj.getDataValue('main_product').getDataValue('favorite'),
                })
            })
            return product_list
        })


        return order_product_list
    }


}





module.exports = new OrderService()
