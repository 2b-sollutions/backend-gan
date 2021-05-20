const { Router } = require('express')
const routes = Router()
const authenticationn = require('../../../../middlewares')
const cartController = require('../../../../controllers/cartController')

routes.post('/', authenticationn.verifyToken, cartController.createCart)
routes.get('/:cartId/cart', cartController.getCartById)
routes.get('/mycart', authenticationn.verifyToken, cartController.getMyCart)
routes.put('/addProduct', authenticationn.verifyToken, cartController.addProduct)
routes.delete('/removeProduct/:productId', authenticationn.verifyToken, cartController.removeProduct)

routes.post('/cep', cartController.getDeliveryCep)
routes.post('/cepTax', cartController.getDeliveryTax)
routes.post('/cart/cepTax', cartController.getDeliveryTaxCart)

// Precisa de perfil**************
routes.get('/:user_id/user', cartController.getUserCarts)
routes.get('/', cartController.getCarts)

module.exports = routes
