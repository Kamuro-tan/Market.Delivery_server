const {Op, Sequelize} = require('sequelize');

const ApiError = require('../../../errors/api-error')
const {Order, OrderProduct, Phase, Product, Customer} = require('../../../models/models')


class OrderService {

    async get(user) {
        const user_ID = user.user_ID

        const order = await Order.findOne({
            attributes: {
                exclude: ['deliveryman'],
            },
            include: [{
                model: OrderProduct,
                attributes: [['product_ID', 'ID'], 'amount'],
            }],
            where: {
                deliveryman: user_ID,
                current_phase: 'Picking',
            }
        })
        .then(async (objs) => {
            const customerID = objs.getDataValue('customer')

            const customer = await Customer.findOne({
                attributes: ['name', 'middle_name', 'surname', 'phone'],
                where: {ID: customerID},
            })

            objs.setDataValue('customer', customer)

            return objs
        })

        if (order == null) {
            throw ApiError.NotFound("You don't have any orders yet.")
        }


        await Order.update({
            current_phase: 'Packing',
        },
        {where: {ID: order.ID}})


        await Phase.update({
            end_time: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {where: {
            phase_name: 'Picking',
            order_ID: order.ID,
        }})


        await Phase.create({
            order_ID: order.ID,
            phase_name: 'Packing',
            start_time: Sequelize.literal('CURRENT_TIMESTAMP'),
        })


        return order
    }


    async orderCollected(orderID) {

        const order = await Order.update({
            current_phase: 'In transit',
        },
        {where: {ID: orderID}})


        await Phase.update({
            end_time: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {where: {
            phase_name: 'Packing',
            order_ID: orderID,
        }})


        await Phase.create({
            order_ID: orderID,
            phase_name: 'In transit',
            start_time: Sequelize.literal('CURRENT_TIMESTAMP'),
        })


        return order
    }


    async orderCompleted(orderID) {

        const order = await Order.update({
            current_phase: 'Completed',
        },
        {where: {ID: orderID}})


        await Phase.update({
            end_time: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {where: {
            phase_name: 'In transit',
            order_ID: orderID,
        }})


        return order
    }


    async getOrderProductList(ID_array) {

        const product_list = await Product.findAll({
            attributes: {
                exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
            },
            where: {ID: ID_array},
        })


        return product_list
    }


    async getOrderProduct(ID) {

        const product = await Product.findOne({
            attributes: {
                exclude: ['cost', 'type_ID'],
            },
            where: {ID},
        })

        return product
    }


}



module.exports = new OrderService()
