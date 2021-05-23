const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  description: { type: String, required: true },
  measure: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Size', Schema)
