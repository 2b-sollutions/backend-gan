const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  profile: { type: Number, required: true },
  password: { type: String, required: true },
  userImage: { type: String }
})

module.exports = mongoose.model('User', Schema)
