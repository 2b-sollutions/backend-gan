const { Router } = require('express')
const routes = Router()
const userController = require("../../controllers/userController")
const authenticationn = require('../../middlewares')


routes.post('/users', userController.createUser)
routes.get('/users', authenticationn.verifyToken, userController.getUser)


//Precisara olhar para  perfil
routes.get('/users/:user_id', authenticationn.verifyToken, userController.getUserById)
routes.delete('/users/:user_id', authenticationn.verifyToken, userController.deleteUser)


module.exports = routes