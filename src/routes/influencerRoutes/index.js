const { Router } = require('express')
const routes = Router()

const influencerController = require("../../controllers/influencerController")

routes.post('/influencers', influencerController.createInfluencer)
routes.get('/influencers', influencerController.getInfluencer)
routes.get('/influencers/:influencer_id', influencerController.getInfluencerById)

module.exports = routes