const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')
const routes = require('./routes')
const swaggerDocument = require('./swagger.json')
const app = express()

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, console.log('Connected to database'))

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(process.env.PORT, () => console.log(`server running in port ${process.env.PORT}`))
