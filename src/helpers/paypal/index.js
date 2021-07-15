const paypal = require('paypal-rest-sdk')
const paypalConfig = require('../../config/index.json')
const OrderDetails = require('../../models/OrderDetails')
paypal.configure(paypalConfig)

module.exports = {
  async create (req) {
    const itemList = []
    try {
      req.body.productList.map(async (element) => {
        const payloadResponse = {
          name: element.productName,
          sku: 'element.productSku',
          price: element.productPrice.toString(),
          currency: 'BRL',
          quantity: element.productQuantity
        }
        itemList.push(payloadResponse)
      })

      const create_payment_json = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        experience_profile_id: "XP-KKBV-GX57-QQAA-TAKM",
        redirect_urls: {
          return_url: 'https://ecommerce-gan-back.herokuapp.com/api/v1/payment/success',
          cancel_url: 'https://ecommerce-gan-back.herokuapp.com/api/v1/payment/cancel'
        },
        transactions: [{
          item_list: {
            items: itemList
          },
          amount: {
            currency: 'BRL',
            total: req.body.totalPrice,
            details: {
              shipping: req.body.shipping,
              subtotal: req.body.subtotal,
              tax: '0'
            }
          },
          description: 'This is the payment description.',
          payment_options: {
            allowed_payment_method: 'IMMEDIATE_PAY'
          }
        }]
      }
      return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, async (error, payment) => {
          if (error) {
            reject(error)
          } else {
            resolve(payment)
          }
        })
      })
    } catch (error) {
      return error
    }
  },
  async success (req, res) {
    try {
      const payerId = req.query.PayerID
      const paymentId = req.query.paymentId
      const token = req.query.token
      const orderDetails = await OrderDetails.find({ 'payment.id': paymentId })
      const valor = {
        currency: 'BRL',
        total: orderDetails[0].payment[0].transactions[0].amount.total
      }
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [{
          amount: valor
        }]
      }

      return new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
          if (error) {
            reject(error.details)
          } else {
            resolve(payment)
          }
        })
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message
      })
    }
  }
}
