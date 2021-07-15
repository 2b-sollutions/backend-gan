const User = require('../../models/User')
const Order = require('../../models/Order')
const OrderDetail = require('../../models/OrderDetails')
const paymentServices = require('../../services/paymentServices')
const comuns = require('../../helpers/comuns')
const enums = require('../../helpers/enums')
const paypal = require('../../helpers/paypal')

module.exports = {

  async buy (req, res) {
    const { token } = req.headers
    const decoded = await comuns.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id

    try {
      const approval_url = []
      const execute_url = []
      const payment = await paypal.create(req)
      const url = payment.links.forEach(item => {
        if (item.rel === 'approval_url') {
          approval_url.push(item.href)
        } else if (item.rel === 'execute') {
          execute_url.push(item.href)
        }
      })
     
      const storeList = await paymentServices.searchStoreByProductList(req.body.productList)
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
        approval_url: approval_url[0],
        execute_url: execute_url[0]
      }
      console.log('LINKS', payment.links)
      const newOrder = await Order.create(payloadNewOrder)
      const userProperties = await User.findById(userId)

      const payloadNewOrderDetails = {
        orderId: newOrder._id,
        cartId: req.body.cartId,
        payment: payment,
        deliveryAdress: req.body.deliveryAdress,
        sendMethod: req.body.sendMethod,
        paymentMethod: req.body.paymentMethod,
        storeList: storeList,
        userName: userProperties.userName
      }
      await OrderDetail.create(payloadNewOrderDetails)
      const payLoadResponse = {
        mode: 'sandbox',
        payId: '',
        approvalUrl: payloadNewOrder.approval_url,
        executeUrl: payloadNewOrder.execute_url.split('/')[6],
        placeholder: 'ppplus',
        payerEmail: 'comprador@ganteste.com',
        payerFirstName: userProperties.userName,
        payerLastName: userProperties.userName,
        payerPhone: '12988108463',
        payerTaxId: '30949017787',
        miniBrowser: false,
        language: 'pt_BR',
        country: 'BR',
        merchantInstallmentSelection: 1,
        merchantInstallmentSelectionOptional: true
      }

      return res.status(200).json(payLoadResponse)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  },
  async success (req, res) {
    try {
      const confirmationPayment = await paypal.success(req)
      const orderDetail = await OrderDetail.find({ 'payment.id': confirmationPayment.id })
      await Order.findByIdAndUpdate(orderDetail[0].orderId, { status: enums.STATUS_PAGAMENTO_CONFIRMADO }, { new: true })
      return res.status(200).json({
        message: 'Pagamento efetuado com sucesso',
        orderNumber: '#454677',
        emailPurchaser: confirmationPayment.email,
        name: { ...confirmationPayment.first_name, ...confirmationPayment.last_name }
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
