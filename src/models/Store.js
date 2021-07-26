const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Array, ref: 'User', required: true },
  cnpj: { type: String, required: true },
  descriptionProfile: { type: String, required: true },
  storeAdress: {
    street: { type: String },
    number: { type: Number },
    city: { type: String },
    postCode: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    complement: { type: String }
  },
  storeAcountBank: {
    agency: { type: Number },
    account: { type: Number },
    bank: { type: String },
    pixKey: { type: String }
  },
  influencerList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }]
})

module.exports = mongoose.model('Store', Schema)
