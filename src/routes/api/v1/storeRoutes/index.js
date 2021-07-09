const { Router } = require('express')
const routes = Router()

const storeController = require('../../../../controllers/storeController')
const authenticationn = require('../../../../middlewares')

routes.post('/', authenticationn.verifyToken, storeController.createStore)
routes.get('/', authenticationn.verifyToken, storeController.getStore)

routes.post('/addInfluencer', authenticationn.verifyToken, storeController.addInfluencer)
routes.post('/removeInfluencer', authenticationn.verifyToken, storeController.removeInfluencer)

routes.get('/productStore', storeController.productStore)

// vai precisar de permissao
routes.get('/:store_id', authenticationn.verifyToken, storeController.getStoreById)

module.exports = routes
