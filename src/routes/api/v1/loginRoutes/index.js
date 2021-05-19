const { Router } = require('express')
const routes = Router()
const { body } = require('express-validator')

const loginController = require('../../../../controllers/loginController')

routes.post('/', [
  body('userName').isEmail(),
  body('password').isLength({ min: 8 }).withMessage('Use 8 ou mais caracteres com uma combinação de pelo menos 1 letra maiúscula e 1 número')
], loginController.createSession)

module.exports = routes
