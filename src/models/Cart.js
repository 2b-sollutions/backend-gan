const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  productList: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    productName: { type: String, required: true },
    productQuantity: { type: Number, default: null },
    productColor: { type: String, default: null },
    productSize: { type: String, default: null },
    productPrice: { type: Number, required: true },
    productImage: { type: String, required: true }
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalTax: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  enable: { type: Boolean, require: true }
}, { timestamps: true })

module.exports = mongoose.model('Cart', Schema)
