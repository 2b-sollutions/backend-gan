const Product = require('../../models/Product')
const Post = require('../../models/Post')
const Store = require('../../models/Store')
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
  async getCepTax (args) {
    try {
      const cepReturn = await calcularPrecoPrazo(args)
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
  async searchAll (req, res) {
    const { filter = 0 } = req.query
    try {
      await Post.find({ userId: userId })
      await Product.find({ userId: userId })
      await Store.find({ userId: userId })

      return res.status(200).json(posts)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async rastreio () {
    const codRastreio = ['OJ694821074BR', 'PW935793588BR'] // array de códigos de rastreios
    return await rastrearEncomendas(codRastreio).then((response) => {
    })
  },
  async verifyProfile (data) {
    if (data.userIdtoken === data.userId) {
      return true
    } else {
      return false
    }
  },
  async awsSendEmail (payload, payload2) {
    try {
      aws.config.setPromisesDependency()
      aws.config.update({
        accessKeyId: process.env.AWS_ACCES_KEY_FEN,
        secretAccessKey: process.env.AWS_SECRET_KEY_FEN,
        region: process.env.AWS_REGION
      })

      const payloadToSend = {
        customerName: payload.userName,
        orderNumber: payload2.orderNumber,
        emailAddress: 'lincoln@fen.social',
        address: {
          addressDsc: payload.deliveryAdress.street,
          number: payload.deliveryAdress.number,
          district: 'São Paulo',
          city: payload.deliveryAdress.city,
          state: payload.deliveryAdress.state
        },
        shipping: {
          method: payload.sendMethod.typeMethod,
          estimateDelivery: payload.sendMethod.deliveryDateEstimated
        },
        payment: {
          method: 'Cartão de Crédito',
          endCardNumber: '5687',
          installments: '3',
          paymentValue: payload.payment.transactions[0].amount.total
        }
      }

      const params = {
        Message: JSON.stringify(payloadToSend),
        // MessageStructure: 'json',
        TopicArn: 'arn:aws:sns:sa-east-1:583919085126:fen-notification-topic'
      }

      // Create promise and SNS service object
      const publishTextPromise = new aws.SNS({ apiVersion: '2010-03-31' }).publish(
        {
          Message: params.Message,
          // MessageStructure: params.MessageStructure,
          TopicArn: params.TopicArn
        }
      ).promise()

      // Handle promise's fulfilled/rejected states
      publishTextPromise.then(
        function (data) {
          console.log(`Message ${payloadToSend} sent to the topic ${params.TopicArn}`)
          console.log('MessageID is ' + data.MessageId)
        }).catch(
        function (err) {
          console.error(err, err.stack)
        })
    } catch (error) {
      return error.message
    }
  }

}
