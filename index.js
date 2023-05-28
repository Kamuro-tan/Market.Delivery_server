require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')
const path = require('path')


const PORT = process.env.PORT || 3000



const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/customer', express.static(path.resolve(__dirname, 'static')))
app.use('/api/deliveryman', express.static(path.resolve(__dirname, 'static')))
app.use(express.static(path.resolve(__dirname, 'static')))

app.use('/api', router)

app.use(errorMiddleware)



const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`))
    }
    catch (e) {
        console.log(e)
    }
}

start()
