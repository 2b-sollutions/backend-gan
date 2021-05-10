const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { consultarCep, calcularPrecoPrazo } = require("correios-brasil");
var multerS3 = require('multer-s3')
const guid = require('guid')
const aws = require("aws-sdk")

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
    },
    async uploadImage(image) {
        try {
            aws.config.setPromisesDependency()
            aws.config.update({
                accessKeyId: 'AKIAQBZSPUH4HNUNDMXY',
                secretAccessKey: '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',
                region: process.env.AWS_REGION
            })
            let fileName = guid.raw().toString()
            const s3 = new aws.S3()
            const rawdata = image
            let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let type = matches[1];
            let bufferImage = new Buffer(matches[2], 'base64')
            var paramsUpload = {
                Bucket: 'upload-fen',
                Key: fileName + '.jpeg',
                Body: bufferImage,
                ACL: 'public-read',
                ContentType: "image/jpeg"
            };
            const responseobject = await s3.listObjectsV2({
                Bucket: 'upload-fen'
            })
            const response = await s3.upload(paramsUpload).promise();
            return response
        } catch (error) {
            return error
        }
    }
}