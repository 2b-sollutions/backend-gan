const { Router } = require('express')
const routes = Router()

const storeController = require('../../controllers/storeController')
const authenticationn = require('../../middlewares')

routes.post('/stores', authenticationn.verifyToken, storeController.createStore)
routes.get('/stores', authenticationn.verifyToken, storeController.getStore)

routes.post('/stores/addInfluencer', authenticationn.verifyToken, storeController.addInfluencer)
routes.post('/stores/removeInfluencer', authenticationn.verifyToken, storeController.removeInfluencer)

// vai precisar de permissao
routes.get('/stores/:store_id', authenticationn.verifyToken, storeController.getStoreById)

module.exports = routes
