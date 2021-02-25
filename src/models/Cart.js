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
    adress: {
        street: {
            type: String,
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    payment: {
        card: {
            bankCoe: {
                type: Number,
            },
            number: {
                type: String,
            },
            cvc: {
                type: Number
            }
        }
    }
})

module.exports = mongoose.model('Cart', Schema)