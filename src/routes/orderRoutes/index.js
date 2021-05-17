const { Router } = require('express')
const routes = Router()
const orderController = require('../../controllers/OrderController')
const authenticationn = require('../../middlewares')

routes.get('/orders/getMyOrders', authenticationn.verifyToken, orderController.getMyOrders)
routes.get('/orders/getOrderDetails/:order_id', authenticationn.verifyToken, orderController.getOrderDetails)

module.exports = routes
