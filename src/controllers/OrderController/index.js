const Order = require('../../models/Order')
const OrderDetails = require('../../models/OrderDetails')
const Helpers = require('../../helpers')
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
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id

    try {
      const order = await Order.find({ userId })
      return res.status(200).json(order)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
