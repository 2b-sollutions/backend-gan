const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  productListImages: { type: Array, default: [], required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productDescription: { type: String },
  productTechnicalDetails: { type: String },
  sku: { type: String, required: true },
  productCategory: {
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    nameCategory: { type: String },
    weightCategory: { type: Number }
  },
  store: {
    idStore: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    nameStore: { type: String },
    imageStore: { type: String }
  },
  detailsProduct: {
    type: [{
      productQuantity: { type: Number, required: true },
      productColor: { type: String, required: true },
      productSize: { type: String, required: true }
    }]
  },
  createdAt: { type: Date }
})

module.exports = mongoose.model('Product', Schema)
