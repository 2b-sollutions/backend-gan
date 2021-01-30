const { Router } = require('express')
const routes = Router()

const loginController = require("../../controllers/loginController")

routes.post('/login', loginController.createSession)


module.exports = routes