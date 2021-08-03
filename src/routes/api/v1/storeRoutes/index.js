const { Router } = require('express')
const routes = Router()

const storeController = require('../../../../controllers/storeController')
const authenticationn = require('../../../../middlewares')

routes.post('/', authenticationn.verifyToken, storeController.createStore)
routes.get('/', authenticationn.verifyToken, storeController.getStore)

routes.post('/add', authenticationn.verifyToken, storeController.addInfluencer)
routes.post('/remove', authenticationn.verifyToken, storeController.removeInfluencer)

routes.get('/:store_id/products', storeController.getProductsByStore)
routes.get('/:store_id', authenticationn.verifyToken, storeController.getStoreById)

routes.get('/:user_name/pages', storeController.getStoreByUsername)
// vai precisar de permissao


module.exports = routes
