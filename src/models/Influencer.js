const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Array, ref: 'User', required: true },
  cellPhone: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  mei: { type: String, required: true },
  measures: {
    height: { type: String, required: true },
    waist: { type: String, required: true },
    bust: { type: String, required: true },
    hip: { type: String, required: true },
    thigh: { type: String, required: true }
  }
})

module.exports = mongoose.model('Influencer', Schema)
