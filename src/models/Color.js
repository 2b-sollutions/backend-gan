const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  description: { type: String, required: true },
  hexadecimal: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Color', Schema)
