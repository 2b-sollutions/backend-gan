const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')
const routes = require('./routes')


const app = express();


require('dotenv').config()


mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, console.log('Connected to database'))

const swaggerDocument = require('./swagger.json');
app.use(cors())
app.use(express.json())
app.use(routes.cartRoutes, routes.loginRoutes, routes.productRoutes, routes.userRoutes, routes.storeRoutes, routes.influencerRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(process.env.PORT, () => console.log(`server running in port ${process.env.PORT}`))