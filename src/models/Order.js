const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.Array,
        ref: 'User',
        required: true,
    },
    store: {
        type: String,
        required: true,
    },
    canceld: {
        type: String,
        required: true,
    },
    delivery: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.Array,
        ref: 'Cart',
        required: true,
    },
    products: [{
        productName: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productImage: { type: String }
    }],
    payment: [{
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    }],
    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Order', Schema)