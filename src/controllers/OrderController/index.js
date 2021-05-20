const Order = require('../../models/Order')
const OrderDetails = require('../../models/OrderDetails')
const Helpers = require('../../helpers/comuns')
const dayjs = require('dayjs')
const { rastrearEncomendas } = require('correios-brasil')
module.exports = {
  async getOrderDetails (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const orderId = req.params.order_id
      const orderDetails = await OrderDetails.find({ orderId: orderId })
      return res.status(200).json(orderDetails)
    } catch (error) {
      return res.status(400).json(error)
    }
  },
  async getMyOrders (req, res) {
    const rastreio = await Helpers.rastreio()
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id

    // const codRastreio = ['QB066124425BR', 'PW935793588BR'] // array de códigos de rastreios
    // rastrearEncomendas(codRastreio).then((response) => {
    //   console.log(response)
    // })
    try {
      const order = await Order.find({ userId })
      const parsedOrder = order.map(element => {
        const parsedOrder = {
          _id: element._id,
          orderNumber: element.orderNumber,
          productList: element.productList,
          productQuantity: element.productQuantity,
          totalPrice: element.totalPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
          status: element.status,
          createdAt: (dayjs(element.createdAt).format('DD/MM/YYYY'))
        }
        return parsedOrder
      })
      console.log(rastreio)
      console.log(parsedOrder)
      return res.status(200).json(parsedOrder)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
