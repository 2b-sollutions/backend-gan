const mongoose = require('mongoose')

const Schema = new mongoose.Schema({

    razaoSocial: {
        type: String,
        required: true,
    },
    celphone: {
        type: String,
        required: true,
    },
    adress: {
        street: {
            type: String
        },
        number: {
            type: Number,
        },
        city: {
            type: String,
        }
    },
    cnpj: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    legalTerms: {
        type: Boolean,
        required: true
    },
    acountBank: [{
        number: {
            type: Number,
        },
        agency: {
            type: Number,
        },
        instituition: {
            type: String,
        },
        cvc: {
            type: Number,
        }
    }],
    influencerList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Influencer',

    }],
    userName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

module.exports = mongoose.model('Store', Schema)