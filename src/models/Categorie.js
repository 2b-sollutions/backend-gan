const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Categorie', Schema)
