const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, unique: true },
  profile: { type: Number, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  cellPhone: { type: String },
  legalTerms: { type: Boolean, required: true },
  userActivate: { type: Boolean, default: true },
  registerCompleted: { type: Boolean, default: false },
  userImage: { type: String, default: null }
}, { timestamps: true })

module.exports = mongoose.model('User', Schema)
