const { Router } = require('express')
const routes = Router()

const cartController = require("../../controllers/cartController")

routes.post('/carts/:user_id', cartController.createCart)
routes.get('/carts/:cart_id', cartController.getUserCarts)
routes.get('/carts/:user_id/:car_id', cartController.getCart)

module.exports = routes