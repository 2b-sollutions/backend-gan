const paypal = require('paypal-rest-sdk')
const paypalConfig = require('../../config/index.json')

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
        redirect_urls: {
          return_url: 'http://localhost:8090/success',
          cancel_url: 'http://cancel.url'
        },
        transactions: [{
          item_list: {
            items: itemList
          // items: [{  name: 'item',    sku: 'item',   price: '1.00',   currency: 'BRL',  quantity: 2   }]
          },
          amount: {
            currency: 'BRL',
            total: req.body.totalPrice
          },
          description: 'This is the payment description.'
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
  }
}
