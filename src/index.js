const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const routes = require('./routes')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, console.log('Connected to database'))


app.use(cors())
app.use(express.json())
app.use(routes.cartRoutes, routes.loginRoutes, routes.productRoutes, routes.userRoutes, routes.storeRoutes, routes.influencerRoutes)


app.listen(process.env.PORT, () => console.log(`server running in port ${process.env.PORT}`))