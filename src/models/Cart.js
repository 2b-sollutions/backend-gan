const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    storeList: {
        type: [{
            storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
            storeName: { type: String, required: true },
            productList: {
                type: [{
                    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Produto", required: true },
                    productName: { type: String, required: true },
                    productQuantity: { type: Number, default: 1 },
                    productColor: { type: String, required: true },
                    productSize: { type: String, required: true },
                    productPrice: { type: Number, required: true }
                }]
            },
        }]
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalTax: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    enable: { type: Boolean }
}, { timestamps: true })

module.exports = mongoose.model('Cart', Schema)