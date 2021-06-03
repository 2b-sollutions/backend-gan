const { Router } = require('express')
const routes = Router()

const paymentController = require('../../../../controllers/paymentController')

routes.post('/buy', paymentController.buy)
routes.get('/success', paymentController.success)
routes.get('/cancel', paymentController.cancel)

module.exports = routes
