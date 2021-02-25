const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../middlewares')
const cartController = require("../../controllers/cartController")

routes.post('/carts', authenticationn.verifyToken, cartController.createCart)
routes.get('/carts/mycart', authenticationn.verifyToken, cartController.getMyCart)

//Precisa de perfil**************
routes.get('/carts/:user_id/', cartController.getUserCarts)
routes.get('/carts', authenticationn.verifyToken, cartController.getCarts)




module.exports = routes