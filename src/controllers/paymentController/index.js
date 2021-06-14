const User = require('../../models/User')
const Order = require('../../models/Order')
const OrderDetail = require('../../models/OrderDetails')
const comuns = require('../../helpers/comuns')
const enums = require('../../helpers/enums')
const paypal = require('../../helpers/paypal')
const valor = {}
module.exports = {

  async buy (req, res) {
    const { token } = req.headers
    const decoded = await comuns.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id

    try {
      const linkPush = []
      const payment = await paypal.create(req)
      const url = payment.links.forEach(item => {
        if (item.rel === 'approval_url') {
          linkPush.push(item.href)
        }
      })
      console.log(url)

      const payloadNewOrder = {
        orderNumber: '#' + Math.floor(Math.random() * (90000 - 10000) + 1000),
        userId: userId,
        productList: [{
          productId: req.body.productList[0]._id,
          productImage: req.body.productList[0].productImage
        }],
        createdAt: new Date(),
        status: enums.STATUS_PAGAMENTO_ENVIADO,
        productQuantity: req.body.productQuantity,
        totalPrice: parseFloat(req.body.totalPrice),
        link: linkPush[0]
      }

      const newOrder = await Order.create(payloadNewOrder)
      const userProperties = await User.findById(userId)
      const payloadNewOrderDetails = {
        orderId: newOrder._id,
        cartId: req.body.cartId,
        payment: payment,
        deliveryAdress: req.body.deliveryAdress,
        sendMethod: req.body.sendMethod,
        paymentMethod: req.body.paymentMethod,
        storeList: req.body.storeList,
        userName: userProperties.userName
      }
      await OrderDetail.create(payloadNewOrderDetails)

      return res.status(200).json(payloadNewOrder)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async success (req, res) {
    try {
      const payerId = req.query.PayerID
      const paymentId = req.query.paymentId
      const token = req.query.token

      const execute_payment_json = {
        payer_id: payerId,
        transactions: [{
          amount: valor
        }]
      }
      paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
          throw error
        } else {
          // const newOrder = await Order.OrderDetail({payment.id = payment[0].id})
          return res.status(200).json({
            message: 'Logado com sucesso',
            token
          })
        }
      })
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async cancel (req, res) {
    const { userName } = req.body
    try {
      const hasUser = await User.findOne({ userName })
      if (hasUser === null) {
        return res.status(404).json({ message: 'Usuario não cadastrado' })
      }
      const payloadRequest = {
        userName: hasUser.userName,
        id: hasUser._id,
        profile: hasUser.profile
      }
      const token = await comuns.createToken(payloadRequest)
      const decoded = await comuns.decodeToken(token, { complete: true })
      return res.status(200).json({
        message: 'Logado com sucesso',
        token,
        decode: decoded.payloadRequest
      })
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
