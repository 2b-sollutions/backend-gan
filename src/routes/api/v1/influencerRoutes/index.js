const { Router } = require('express')
const routes = Router()

const influencerController = require('../../../../controllers/influencerController')
const authenticationn = require('../../../../middlewares')

routes.post('/', authenticationn.verifyToken, influencerController.createInfluencer)
routes.get('/myAcount', authenticationn.verifyToken, influencerController.getMyAcount)

// Precisa de perfil
routes.get('/', influencerController.getInfluencer)
routes.get('/:userName/store', influencerController.getInfluencerByUserName)
routes.get('/myStores', authenticationn.verifyToken, influencerController.getMyStores)

module.exports = routes
