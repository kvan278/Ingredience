const mongoose = require('mongoose')

const ContactQuerySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number
    }
})

module.exports = mongoose.model('ContactQueries', ContactQuerySchema, 'ContactQueries')
