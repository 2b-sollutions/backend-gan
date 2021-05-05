const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.Array, ref: 'User', required: true },
    cellPhone: { type: String, required: true },
    email: { type: String, required: true },
    cpf: { type: String, required: true },
    mei: { type: String, required: true },
    adress: {
        street: { type: String },
        number: { type: Number },
        city: { type: String }
    },
    acountBank: [{
        number: { type: Number },
        agency: { type: Number },
        instituition: { type: String },
        cpf: { type: String }
    }]
})

module.exports = mongoose.model('Influencer', Schema)