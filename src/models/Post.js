const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: { type: String },
    createdAt: { type: Date },
    description: { type: String },
    userImage: { type: String },
    productList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    imageList: { type: Array, default: [], required: true },
})

module.exports = mongoose.model('Post', Schema)