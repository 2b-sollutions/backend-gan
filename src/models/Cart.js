const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    totalValue: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    enable: {
        type: Boolean
    }
})

module.exports = mongoose.model('Cart', Schema)