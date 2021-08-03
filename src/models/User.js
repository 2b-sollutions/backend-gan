const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  fullname: { type: String, required: false, unique: true },
  userName: { type: String, required: true, unique: true },
  profile: { type: Number, required: true },
  password: { type: String, required: true },
  email: { type: String },
  cellPhone: { type: String },
  legalTerms: { type: Boolean, required: true },
  userActivate: { type: Boolean, default: true },
  registerCompleted: { type: Boolean, default: false },
  userImage: { type: String, default: null }
}, { timestamps: true })

module.exports = mongoose.model('User', Schema)
