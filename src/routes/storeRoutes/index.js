const { Router } = require('express')
const routes = Router()

const storeController = require("../../controllers/storeController")
const authenticationn = require('../../helpers')

routes.post('/stores', authenticationn.verifyToken, storeController.createStore)
routes.get('/stores', storeController.getStore)
routes.get('/stores/:store_id', storeController.getStoreById)

routes.post('/stores/:store_id', storeController.addInfluencer)
routes.post('/stores/removeInfluencer/:store_id', storeController.removeInfluencer)

module.exports = routes