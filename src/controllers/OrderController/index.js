const Order = require('../../models/Order')
const OrderDetails = require('../../models/OrderDetails')
const Helpers = require('../../helpers/comuns')
const dayjs = require('dayjs')

module.exports = {
  async getOrderDetails (req, res) {
    const { token } = req.headers
    const decoded = await Helpers.decodeToken(token, { complete: true })
    const userId = decoded.payloadRequest.id
    try {
      const orderId = req.params.order_id
      const orderDetails = await OrderDetails.find({ orderId: orderId })
      const order = await Order.findById({ _id: orderId })
      const storeListNew = await Promise.all(orderDetails[0].storeList.map(async store => {
        const productListNew = await store.productList.map(product => {
          const productListNew = {
            productName: product.productName,
            productColor: product.productColor,
            productSize: product.productSize,
            productPrice: product.productPrice,
            productQuantity: product.productQuantity,
            productImage: product.productImage
          }
          return productListNew
        })
        const storeListResponse = {
          storeName: store.storeName,
          storeImage: store.storeImage,
          productList: productListNew
        }
        return storeListResponse
      }))
      const payloadResponse = {
        deliveryAdress: orderDetails[0].deliveryAdress,
        sendMethod: orderDetails[0].sendMethod,
        paymentMethod: orderDetails[0].paymentMethod,
        resumeOrder: {
          totalQuantity: order.productQuantity,
          totalValue: order.totalPrice,
          storeList: storeListNew
        }
      }
      return res.status(200).json(payloadResponse)
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
      return res.status(200).json(parsedOrder)
    } catch (error) {
      return res.status(400).json(error.message)
    }
  }
}
