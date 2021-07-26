const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Array, ref: 'User', required: true },
  cpf: { type: String, required: true },
  descriptionProfile: { type: String, required: true },
  measures: {
    height: { type: String, required: true },
    waist: { type: String, required: true },
    bust: { type: String, required: true },
    hip: { type: String, required: true },
    thigh: { type: String, required: true }
  },
  influencerAdress: {
    street: { type: String },
    number: { type: Number },
    city: { type: String },
    postCode: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    complement: { type: String }
  },
  influencerAcountBank: {
    agency: { type: Number },
    account: { type: Number },
    bank: { type: String },
    pixKey: { type: String }
  }
})

module.exports = mongoose.model('Influencer', Schema)
