const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { consultarCep, calcularPrecoPrazo } = require("correios-brasil");


module.exports = {

    async encryptPassword(password) {

        const salt = await bcrypt.genSalt(10)
        const encryptPassword = await bcrypt.hash(password, salt)
        return encryptPassword

    },
    async decryptPassword(passwordParams) {

        const { requestPass, responsePass } = passwordParams

        const isValid = await bcrypt.compare(requestPass, responsePass)

        return isValid
    },
    async createToken(payloadRequest) {

        const secretKey = process.env.SECRET_KEY
        const expirationTime = process.env.TOKEN_EXPIRATION_TIME

        const token = jwt.sign({ payloadRequest }, secretKey, { expiresIn: expirationTime })

        return token

    },
    async verifyToken(req) {
        const token = req.headers.token
        const secretKey = process.env.SECRET_KEY
        const validToken = await jwt.verify(token, secretKey)

        return validToken

    },
    async decodeToken(token) {
        const secretKey = process.env.SECRET_KEY
        const decodedToken = jwt.decode(token, secretKey)

        return decodedToken
    },
    async getCep(cep) {
        try {
            const cepReturn = await consultarCep(cep)
            return cepReturn


        } catch (error) {
            return error
        }

    },
    async getCepTax(cep) {
        try {
            const cepReturn = await calcularPrecoPrazo(cep)
            return cepReturn


        } catch (error) {
            return error
        }

    }

}