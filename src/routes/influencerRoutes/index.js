const { Router } = require('express')
const routes = Router()

const influencerController = require("../../controllers/influencerController")
const authenticationn = require('../../middlewares')

routes.post('/influencers', authenticationn.verifyToken, influencerController.createInfluencer)
routes.get('/influencers/myAcount', authenticationn.verifyToken, influencerController.getMyAcount)


// Precisa de perfil
routes.get('/influencers', influencerController.getInfluencer)
routes.get('/influencers/postInfluencer', influencerController.getPostInfluencer)
routes.get('/influencers/:userName', influencerController.getInfluencerByUserName)



module.exports = routes