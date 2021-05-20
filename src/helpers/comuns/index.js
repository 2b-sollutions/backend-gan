const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { consultarCep, calcularPrecoPrazo, rastrearEncomendas } = require('correios-brasil')
const guid = require('guid')
const aws = require('aws-sdk')

module.exports = {
  async encryptPassword (password) {
    const salt = await bcrypt.genSalt(10)
    const encryptPassword = await bcrypt.hash(password, salt)
    return encryptPassword
  },
  async decryptPassword (passwordParams) {
    const { requestPass, responsePass } = passwordParams
    const isValid = await bcrypt.compare(requestPass, responsePass)
    return isValid
  },
  async createToken (payloadRequest) {
    const secretKey = process.env.SECRET_KEY
    const expirationTime = process.env.TOKEN_EXPIRATION_TIME
    const token = jwt.sign({ payloadRequest }, secretKey, { expiresIn: expirationTime })
    return token
  },
  async verifyToken (req) {
    const token = req.headers.token
    const secretKey = process.env.SECRET_KEY
    const validToken = await jwt.verify(token, secretKey)
    return validToken
  },
  async decodeToken (token) {
    const secretKey = process.env.SECRET_KEY
    const decodedToken = jwt.decode(token, secretKey)
    return decodedToken
  },
  async getCep (cep) {
    try {
      const cepReturn = await consultarCep(cep)
      return cepReturn
    } catch (error) {
      return error
    }
  },
  async getCepTax (cep) {
    try {
      const cepReturn = await calcularPrecoPrazo(cep)
      return cepReturn
    } catch (error) {
      return error
    }
  },
  async uploadImage (image) {
    try {
      aws.config.setPromisesDependency()
      aws.config.update({
        accessKeyId: process.env.AWS_ACCES_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
      })

      console.log(process.env.AWS_SECRET_KEY)
      const fileName = guid.raw().toString()
      const s3 = new aws.S3()
      const rawdata = image
      const matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      const type = matches[1]
      const bufferImage = new Buffer.from(matches[2], 'base64')
      const paramsUpload = {
        Bucket: 'upload-fen',
        Key: fileName + '.jpeg',
        Body: bufferImage,
        ACL: 'public-read',
        ContentType: 'image/jpeg'
      }
      const response = await s3.upload(paramsUpload).promise()
      return response
    } catch (error) {
      return error
    }
  },
  async rastreio () {
    const codRastreio = ['OJ694821074BR', 'PW935793588BR'] // array de códigos de rastreios
    return await rastrearEncomendas(codRastreio).then((response) => {
      console.log(response)
    })
  }

}
