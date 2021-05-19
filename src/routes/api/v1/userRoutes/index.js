const { Router } = require('express')
const routes = Router()
const userController = require('../../../../controllers/userController')
const authenticationn = require('../../../../middlewares')
const { body } = require('express-validator')

routes.post('/', [body('password').isLength({ min: 8 }).withMessage('Use 8 ou mais caracteres com uma combinação de pelo menos 1 letra maiúscula e 1 número')],

  userController.createUser)
routes.get('/', authenticationn.verifyToken, userController.getUser)

// Precisara olhar para  perfil
routes.get('/:user_id', authenticationn.verifyToken, userController.getUserById)
routes.delete('/:user_id', authenticationn.verifyToken, userController.deleteUser)

module.exports = routes
