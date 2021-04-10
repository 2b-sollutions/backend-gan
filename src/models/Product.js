const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
    },
    productPrice: {
        type: Number,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productImage: {
        type: String
    },
    productCategory: {
        type: String
    },
    productColor: {
        type: String
    },
    productSize: {
        type: String
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
})

module.exports = mongoose.model('Product', Schema)