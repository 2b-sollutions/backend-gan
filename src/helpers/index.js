const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');



module.exports = {

    async encryptPassword(password) {

        const salt = await bcrypt.genSalt(10)
        const encryptPassword = await bcrypt.hash(password, salt)
        return encryptPassword

    },
    async dencryptPassword(passwordParams) {

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
    async verifyToken(token) {

        const secretKey = process.env.SECRET_KEY
        const validToken = jwt.verify(token, secretKey)

        return validToken

    },
    async decodeToken(token) {
        const secretKey = process.env.SECRET_KEY
        const decodedToken = jwt.decode(token, secretKey)

        return decodedToken
    }
}