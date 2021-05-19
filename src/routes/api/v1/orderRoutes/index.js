const { Router } = require('express')
const routes = Router()
const orderController = require('../../../../controllers/OrderController')
const authenticationn = require('../../../../middlewares')

routes.get('/getMyOrders', authenticationn.verifyToken, orderController.getMyOrders)
routes.get('/getOrderDetails/:order_id', authenticationn.verifyToken, orderController.getOrderDetails)

module.exports = routes
