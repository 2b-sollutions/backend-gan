const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    orderNumber: { type: Number, required: true },
    deliveryAdress: { type: String, required: true },
    sendMethod: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    user: { type: mongoose.Schema.Types.Array, ref: 'User', required: true },
    canceld: { type: String, required: true },
    delivery: { type: String, required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    payment: { type: mongoose.Schema.Types.Array, ref: "Payment", required: true },
    createdAt: { type: Date, required: true },
    status: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
})

module.exports = mongoose.model('Order', Schema)