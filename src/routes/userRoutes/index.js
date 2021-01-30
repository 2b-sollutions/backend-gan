const { Router } = require('express')
const routes = Router()

const userController = require("../../controllers/userController")
const authenticationn = require('../../middlewares')

routes.post('/users', userController.createUser)
routes.get('/users', authenticationn.verifyToken, userController.getUser)
routes.get('/users/:user_id', userController.getUserById)
routes.delete('/users/:user_id', userController.deleteUser)

module.exports = routes