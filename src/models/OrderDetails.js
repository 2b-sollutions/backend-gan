const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  payment: { type: mongoose.Schema.Types.Array, ref: 'Payment', required: true },
  deliveryAdress: {
    userName: { type: String },
    street: { type: String },
    number: { type: Number },
    city: { type: String },
    state: { type: String },
    postCode: { type: String, required: true }
  },
  sendMethod: {
    typeMethod: { type: String },
    deliveryDateEstimated: { type: String },
    price: { type: Number }
  },
  paymentMethod: {
    typeMethod: { type: String },
    deliveryDateEstimated: { type: String }
  },
  storeList: [{
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    storeName: { type: String, required: true },
    productList: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: false },
      productName: { type: String, required: false },
      productQuantity: { type: Number, default: 1 },
      productColor: { type: String, required: false },
      productSize: { type: String, required: false },
      productPrice: { type: Number, required: false },
      productDescription: { type: String, required: false },
      productImage: { type: String, required: false }
    }]
  }]
})

module.exports = mongoose.model('OrderDetail', Schema)
