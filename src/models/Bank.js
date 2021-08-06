const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  ispb: { type: String, required: true },
  bankName: { type: String, required: true },
  bankCode: { type: String, required: true },
  bankFullName: { type: String, required: true }
})

module.exports = mongoose.model('Bank', Schema)
