const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.Array,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
    },
    description: {
        type: String
    },
})

module.exports = mongoose.model('Post', Schema)