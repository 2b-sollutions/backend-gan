const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    orderNumber: { type: Number, required: true },
    productList: [{
        productId: { type: String, required: true },
        productImage: { type: String },
    }],
    productQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, required: true }
})

module.exports = mongoose.model('Order', Schema)