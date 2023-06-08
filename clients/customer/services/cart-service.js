const {Op, Sequelize} = require('sequelize');

const ApiError = require('../../../errors/api-error')
const {Product, Order, Store, AvailableEmployee, OrderProduct, Phase} = require('../../../models/models')



class CartService {

    async getCartProductList(user, ID_array) {
        var product_list


        if (user) {
            const customer_ID = user.user_ID

            product_list = await Product.findAll({
                attributes: {
                    include: [[Sequelize.literal('exists(select * from "main_customer_favorite" as F where F."product_ID" = "main_product"."ID"  and F."customer_ID" = ' + customer_ID + ')'), 'favorite']],
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
                where: {ID: ID_array},
            })

        } else {

            product_list = await Product.findAll({
                attributes: {
                    exclude: ['cost', 'shelf_life', 'storage_conditions', 'type_ID'],
                },
                where: {ID: ID_array},
            })
        }


        return product_list
    }


    async getOrderInfo(order_params) {
        const {address, coordinates, price, products_amount, product_list} = order_params


        const [store, distance_to_store] = await getStore(coordinates)
        const [products, products_full_weight] = await checkProductList(price, products_amount, product_list)


        return getOrderDurationAndPrice(distance_to_store, price, products_amount, products_full_weight)
    }


    async placeOrder(user, order_params) {
        const {address, coordinates, price, products_amount, product_list} = order_params

        const [store, distance_to_store] = await getStore(coordinates)
        const [products, products_full_weight] = await checkProductList(price, products_amount, product_list)
        const [duration, order_price] = getOrderDurationAndPrice(distance_to_store, price, products_amount, products_full_weight)


        const availableEmployee = await AvailableEmployee.findOne({where: {store_ID: store.ID}})

        const order = await Order.create({
            address: address,
            coordinates: coordinates,
            distance: distance_to_store,
            weight: products_full_weight,
            order_time: Sequelize.literal('CURRENT_TIMESTAMP'),
            estimated_time: duration,
            price: order_price,
            current_phase: 'Picking',

            customer: user.user_ID,
            deliveryman: availableEmployee.employee_ID,
        })


        const order_ID = order.ID
        var order_products = []
        product_list.forEach((product) => {
            order_products.push({
                amount: product.amount,
                product_ID: product.ID,
                order_ID: order_ID,
            })
        })
        await OrderProduct.bulkCreate(order_products)

        await Phase.create({
            order_ID: order_ID,
            phase_name: 'Picking',
            start_time: Sequelize.literal('CURRENT_TIMESTAMP'),
        })

        await availableEmployee.destroy()

        return order_ID
    }


}



// ФУНКЦИЯ ВЫБОРА МАГАЗИНА, ИЗ КОТОРОГО БУДЕТ ОСУЩЕСТВЛЯТЬСЯ ДОСТАВКА
async function getStore(coordinates) {
    const storeSearchRadius = 0.06 // радиус поиска магазина (в градусах для долготы и широты)
    var distance_to_store = Number.MAX_SAFE_INTEGER // дистанция до магазина в метрах


    const store = await Store.findAll({
        include: [{
            model: AvailableEmployee,
            attributes: [],
            required: true,
        }],
        where: {
            coordinates: Sequelize.where(
                Sequelize.literal('sqrt(("main_store"."coordinates"[1] - ' + coordinates[0] + ')^2 + ("main_store"."coordinates"[2] - ' + coordinates[1] + ')^2)'),
                '<',
                storeSearchRadius)
        }
    })
    .then((objs) => {
        var cur_distance, cur_store, closest_store

        objs.forEach((obj) => {
            cur_store = obj.dataValues
            cur_distance = distance(cur_store.coordinates[0], cur_store.coordinates[1], coordinates[0], coordinates[1])

            if (cur_distance < distance_to_store) {
                distance_to_store = cur_distance
                closest_store = cur_store
            }
        })

        return closest_store
    })


    if (!store) {
        throw ApiError.NotFound("Sorry, the store chain doesn't serve entered point in this moment!")
    }
    distance_to_store = (distance_to_store / 1000).toFixed(1)


    return [store, distance_to_store]
}

// ФУНКЦИЯ РАССЧЁТА РАССТОЯНИЯ МЕЖДУ ТОЧКАМИ ПО ИХ КОРДИНАТАМ
function distance(latA, longA, latB, longB) {
    var EARTH_RADIUS = 6372795;//радиус земли в метрах.
    //Переводим угловые координаты в радианы, для функций javascript Math которые работают с радианами.
    let lat1 = latA * Math.PI / 180;
    let lat2 = latB * Math.PI / 180;
    let long1 = longA * Math.PI / 180;
    let long2 = longB * Math.PI / 180;

    //Получаем угловое расстояние в радианах, и так как в радианах просто умножаем на радиус.
    let a = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(long2 - long1));
    return EARTH_RADIUS * a;
}


// ФУНКЦИЯ ПРОВЕРКИ СПИСКА ПРОДУКТОВ В ЗАКАЗЕ + (получение их суммарного веса)
async function checkProductList(price, amount, product_list) {
    var ID_array = [] // массив ID продуктов, для их извлечения из базы данных
    var products_full_price = 0 // суммарная цена всех продуктов в заказе
    var products_full_weight = 0 // суммарная масса всех продуктов в заказе
    var products_amount = 0 // количество продуктов в заказе (высчитываемое)

    // получение ID первого и последнего продуктов в базе данных из рассчета того, что в ней нет пробелов
    var min_ID = await Product.findOne().then(obj => obj.dataValues.ID) // минимальный ID продукта в базе данных
    var max_ID = await Product.findOne({order: [['ID', 'DESC']]}).then(obj => obj.dataValues.ID) // максимальный ID продукта в базе данных

    product_list.sort((a, b) => a.ID > b.ID ? 1 : -1) // сортировка массива по ID


    product_list.forEach(product => {
        ID_array.push(product.ID)

        if ((min_ID > product.ID) || (product.ID > max_ID)) {
            throw ApiError.BadRequest("Product in your Cart with ID: " + product.ID + " doesn't exist.")
        }
    })

    const products = await Product.findAll({
        where: {ID: ID_array}
    })
    .then((objs) => {
        var product
        var i = 0

        objs.forEach((obj) => {
            product = obj.dataValues

            if (product.by_weight == true) {
                products_full_price += product.price * product_list[i].amount / (product.weight / 1000)
                products_full_weight += product_list[i].amount * 1000

            } else {
                products_full_price += product.price * product_list[i].amount
                products_full_weight += product.weight * product_list[i].amount

            }

            i++
            products_amount++
        })
        return objs
    })

    if (products_amount != amount) {
        throw ApiError.BadRequest("Some of your product list is not relevant.")
    }

    products_full_price = Math.round(products_full_price * 100)/ 100;
    if (products_full_price != price) {
        throw ApiError.BadRequest("Price of your product list is not relevant.")
    }

    products_full_weight = (products_full_weight / 1000).toFixed(1)


    return [products, products_full_weight]
}


// ФУНКЦИЯ РАСЧЕТА СТОИМОСТИ И ДЛИТЕЛЬНОСТИ ВЫПОЛНЕНИЯ ЗАКАЗА
function getOrderDurationAndPrice(distance_to_store, products_full_price, products_amount, products_full_weight) {
    const min_weight = 5 // минимальная масса при рассчёте стоимости доставки
    const weight_coeff = 0.1 // коэффициент увеличения стоимости доставки за каждый килограмм свыше минимальной массы
    const distance_price = 80 // стоимость доставки на расстоянии 1 километр
    const distance_coeff = 80 //distance_price / 1000 // стандартная стоимость доставки за 1 метр ходьбы без учёта массы заказа
    var coeff_with_mass = distance_coeff // коэффициент доставки за 1 метр с учетом массы заказа

    // в случае, если масса закза < min_weight, то испольуется стандартный коэффициент не учитвыющий массу
    if (products_full_weight > min_weight) {
        coeff_with_mass += distance_coeff * (products_full_weight - min_weight) * weight_coeff
    }

    var delivery_price = distance_to_store * coeff_with_mass
    if (delivery_price < 199) {
        delivery_price = 199
    }


    var order_price = products_full_price + delivery_price
    order_price = order_price.toFixed(2)


    const speed = 5 // скорость исполнителя при выполнении доставки в км/ч
    const product_collecting_time = 4 // время затрачиваемое на сбор одного типа продукта
    var duration // длительность выполнения заказа в минутах
    duration = distance_to_store / speed * 60 + (products_amount* product_collecting_time)
    duration = duration.toFixed()


    return [duration, order_price]
}


module.exports = new CartService()
