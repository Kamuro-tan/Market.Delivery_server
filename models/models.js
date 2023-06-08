const {DataTypes} = require('sequelize')

const sequelize = require('../db')



const Category = sequelize.define('main_product_category', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    name:                   {type: DataTypes.STRING,            unique: true,       allowNull: false},
})


const Type = sequelize.define('main_product_type', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    name:                   {type: DataTypes.STRING,            unique: true,       allowNull: false},
})


const Product = sequelize.define('main_product', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    name:                   {type: DataTypes.STRING,            unique: true,       allowNull: false},
    price:                  {type: DataTypes.DECIMAL,                               allowNull: false},
    cost:                   {type: DataTypes.DECIMAL,                               allowNull: false},
    by_weight:              {type: DataTypes.BOOLEAN,                               allowNull: false,           defaultValue: false},
    weight:                 {type: DataTypes.INTEGER,                               allowNull: false},
    shelf_life:             {type: DataTypes.INTEGER,                               allowNull: false},
    storage_conditions:     {type: DataTypes.TEXT},
})


const OrderProduct = sequelize.define('main_order_product', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    amount:                 {type: DataTypes.DECIMAL,                               allowNull: false},
})



const Store = sequelize.define('main_store', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    address:                {type: DataTypes.STRING,                                allowNull: false},
    coordinates:            {type: DataTypes.ARRAY(DataTypes.DECIMAL),              allowNull: false},
    description:            {type: DataTypes.TEXT},
})


const Employee = sequelize.define('main_employee', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    surname:                {type: DataTypes.STRING,                                allowNull: false},
    name:                   {type: DataTypes.STRING,                                allowNull: false},
    middle_name:            {type: DataTypes.STRING},
    born_date:              {type: DataTypes.DATEONLY,                              allowNull: false},
    phone:                  {type: DataTypes.STRING,            unique: true,       allowNull: false},
    email:                  {type: DataTypes.STRING,            unique: true},
})

const EmployeeAccount = sequelize.define('main_employee_account', {
    employee_ID:            {type: DataTypes.BIGINT,            primaryKey: true},
    is_active:              {type: DataTypes.BOOLEAN,                               allowNull: false,       defaultValue: true},
    username:               {type: DataTypes.STRING,            unique: true,       allowNull: false},
    password:               {type: DataTypes.STRING,                                allowNull: false},
})



const Order = sequelize.define('main_order', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    address:                {type: DataTypes.STRING},
    coordinates:            {type: DataTypes.ARRAY(DataTypes.DECIMAL),              allowNull: false},
    distance:               {type: DataTypes.DECIMAL,                               allowNull: false},
    weight:                 {type: DataTypes.DECIMAL,                               allowNull: false},
    order_time:             {type: DataTypes.DATE,                                  allowNull: false},
    estimated_time:         {type: DataTypes.INTEGER,                               allowNull: false},
    price:                  {type: DataTypes.DECIMAL,                               allowNull: false},
    current_phase:          {type: DataTypes.ENUM('Picking', 'Packing', 'In transit', 'Completed', 'Canceled')},
})



const Customer = sequelize.define('main_customer', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    surname:                {type: DataTypes.STRING,                                allowNull: false},
    name:                   {type: DataTypes.STRING,                                allowNull: false},
    middle_name:            {type: DataTypes.STRING},
    born_date:              {type: DataTypes.DATEONLY,                              allowNull: false},
    phone:                  {type: DataTypes.STRING,            unique: true,       allowNull: false},
    email:                  {type: DataTypes.STRING,            unique: true},
})

const CustomerAccount = sequelize.define('main_customer_account', {
    customer_ID:            {type: DataTypes.BIGINT,            primaryKey: true},
    is_active:              {type: DataTypes.BOOLEAN,                               allowNull: false,       defaultValue: true},
})

const Favorite = sequelize.define('main_customer_favorite', {
    customer_ID:            {type: DataTypes.BIGINT,            primaryKey: true},
    product_ID:             {type: DataTypes.BIGINT,            primaryKey: true},
})


const Phase = sequelize.define('main_order_phase', {
    ID:                     {type: DataTypes.BIGINT,            primaryKey: true,   autoIncrement: true},
    phase_name:             {type: DataTypes.ENUM('Picking', 'Packing', 'In transit', 'Completed', 'Canceled')},
    start_time:             {type: DataTypes.DATE,                                  allowNull: false},
    end_time:               {type: DataTypes.DATE},
})



const PhoneVerify = sequelize.define('app_phone_verify', {
    phone:                  {type: DataTypes.STRING,            primaryKey: true,   allowNull: false},
    session_token:          {type: DataTypes.STRING,                                allowNull: false},
    security_code:          {type: DataTypes.STRING,                                allowNull: false},
    created_at:             {type: DataTypes.DATE,                                  allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    is_verified:            {type: DataTypes.BOOLEAN,                               allowNull: false,       defaultValue: false},
})


const UserToken = sequelize.define('app_user_token', {
    user_ID:                {type: DataTypes.BIGINT,            primaryKey: true,   allowNull: false},
    user_type:              {type: DataTypes.ENUM('customer', 'deliveryman', 'collector'),
                                                                primaryKey: true,   allowNull: false},
    token:                  {type: DataTypes.STRING,                                allowNull: false},
})


const AvailableEmployee = sequelize.define('app_available_employee', {
    store_ID:               {type: DataTypes.BIGINT,            primaryKey: true},
    employee_ID:            {type: DataTypes.BIGINT,            primaryKey: true},
})



/*
-----------------------------------------------------------------------------------------------------
----------------------------------------    RELATIONSHIPS    ----------------------------------------
-----------------------------------------------------------------------------------------------------
*/

/*    ________________________________    PRODUCT    ________________________________    */

//  One-to-Many (1 -- : -0 M) between Category and Type
Category.hasMany(Type, {
    foreignKey: 'category_ID',
})
Type.belongsTo(Category, {
    foreignKey: 'category_ID',
    allowNull: false,
})


//  One-to-Many (1 -- : -0 M) between Type and Product
Type.hasMany(Product, {
    foreignKey: 'type_ID',
})
Product.belongsTo(Type, {
    foreignKey: {
        name: 'type_ID',
        allowNull: false,
    }
})


//  One-to-Many (1 -- : -0 M) between Product and OrderProduct
Product.hasMany(OrderProduct, {
    foreignKey: 'product_ID',
})
OrderProduct.belongsTo(Product, {
    foreignKey: {
        name: 'product_ID',
        allowNull: false,
    }
})




/*    ________________________________    STORE STRUCTURE    ________________________________    */

//  One-to-Many (1 -0 : -0 M) between Store and Employee
Store.hasMany(Employee, {
    foreignKey: 'store_ID',
})
Employee.belongsTo(Store, {
    foreignKey: {
        name: 'store_ID',
        allowNull: true,
    }
})


//  One-to-One (1 -- : -0 1) between Employee and EmployeeAccount
Employee.hasOne(EmployeeAccount, {
    foreignKey: 'employee_ID',
})
EmployeeAccount.belongsTo(Employee, {
    source: 'employee_ID',
    foreignKey: {
        name: 'employee_ID',
        allowNull: false,
    },
})


// One-to-Many (1 -0 : -0 M) between Store and AvailableEmployee
Store.hasMany(AvailableEmployee, {
    foreignKey: 'store_ID',
})
AvailableEmployee.belongsTo(Store, {
    source: 'store_ID',
    foreignKey: {
        name: 'store_ID',
        allowNull: false,
    },
})

// One-to-One (1 -- : -0 1) between Employee and AvailableEmployee
EmployeeAccount.hasOne(AvailableEmployee, {
    foreignKey: 'employee_ID',
})
AvailableEmployee.belongsTo(EmployeeAccount, {
    source: 'employee_ID',
    foreignKey: {
        name: 'employee_ID',
        allowNull: false,
    },
})




/*    ________________________________    CUSTOMER    ________________________________    */

//  One-to-One (1 -- : -0 1) between Customer and CustomerAccount
Customer.hasOne(CustomerAccount, {
    foreignKey: 'customer_ID',
})
CustomerAccount.belongsTo(Customer, {
    source: 'customer_ID',
    foreignKey: {
        name: 'customer_ID',
        allowNull: false,
    },
})




/*    ________________________________    FAVORITE    ________________________________    */
//  Many-to-Many (M 0- : -0 M) between Product and CustomerAccount
// CustomerAccount.belongsToMany(Product, {through: Favorite, foreignKey: 'customer_ID'})
// Product.belongsToMany(CustomerAccount, {through: Favorite, foreignKey: 'product_ID'})

//  One-to-Many (1 -- : -0 M) between CustomerAccount and Favorite
CustomerAccount.hasMany(Favorite, {
    foreignKey: 'customer_ID',
})
Favorite.belongsTo(CustomerAccount, {
    source: 'customer_ID',
    foreignKey: {
        name: 'customer_ID',
        allowNull: false,
    }
})

//  One-to-Many (1 -- : -0 M) between Product and Favorite
Product.hasMany(Favorite, {
    foreignKey: 'product_ID',
})
Favorite.belongsTo(Product, {
    source: 'product_ID',
    foreignKey: {
        name: 'product_ID',
        allowNull: false,
    }
})




/*    ________________________________    DELIVERY SYSTEM STRUCTURE    ________________________________    */

//  One-to-Many (1 -- : -0 M) between EmployeeAccount and Order for DELIVERYMAN
EmployeeAccount.hasMany(Order, {
    foreignKey: 'deliveryman',
})
Order.belongsTo(EmployeeAccount, {
    foreignKey: {
        name: 'deliveryman',
        allowNull: false,
    }
})


//  One-to-Many (1 -- : -- M) between Order and OrderProduct
Order.hasMany(OrderProduct, {
    foreignKey: 'order_ID',
    allowNull: false,
})
OrderProduct.belongsTo(Order, {
    foreignKey: {
        name: 'order_ID',
        allowNull: false,
    }
})


//  One-to-Many (1 -- : -- M) between Order and Phase
Order.hasMany(Phase, {
    foreignKey: 'order_ID',
    allowNull: false,
})
Phase.belongsTo(Order, {
    foreignKey: {
        name: 'order_ID',
        allowNull: false,
    }
})


//  One-to-Many (1 -- : -0 M) between CustomerAccount and Order
CustomerAccount.hasMany(Order, {
    foreignKey: 'customer',
})
Order.belongsTo(CustomerAccount, {
    foreignKey: {
        name: 'customer',
        allowNull: false,
    }
})





module.exports = {
    Category,
    Type,
    Product,
    OrderProduct,
    Store,
    Employee,
    EmployeeAccount,
    Customer,
    CustomerAccount,
    Favorite,
    Order,
    Phase,
    PhoneVerify,
    UserToken,
    AvailableEmployee,
}
