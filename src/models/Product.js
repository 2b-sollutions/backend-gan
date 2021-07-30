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
    userId: { type: String },
    userName: { type: String },
    userImage: { type: String }
  },
  detailsProduct: {
    hexadecimal: { type: Number, required: true },
    colorName: { type: Number, required: true },
    disponibility: {
      productQuantity: { type: Number, required: true },
      productSize: { type: String, required: true }
    }
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', Schema)







