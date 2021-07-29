const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  userId: { type: String },
  description: { type: String },
  technicalDetails: { type: String },
  userImage: { type: String },
  productList: { type: Array, default: [], required: true },
  imagePostList: { type: Array, default: [], required: true }
}, { timestamps: true })

module.exports = mongoose.model('Post', Schema)
