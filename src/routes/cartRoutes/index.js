const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../middlewares')
const cartController = require("../../controllers/cartController")

routes.post('/carts', authenticationn.verifyToken, cartController.createCart)
routes.get('/carts/mycart', authenticationn.verifyToken, cartController.getMyCart)
routes.put('/carts/addProduct', authenticationn.verifyToken, cartController.addProduct)
routes.delete('/carts/removeProduct', authenticationn.verifyToken, cartController.removeProduct)


routes.post('/carts/cep', cartController.getDeliveryCep)
routes.post('/carts/cepTax', cartController.getDeliveryTax)

//Precisa de perfil**************
routes.get('/carts/:user_id/', cartController.getUserCarts)
routes.get('/carts', authenticationn.verifyToken, cartController.getCarts)





module.exports = routes