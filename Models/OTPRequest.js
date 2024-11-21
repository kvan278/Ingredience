const mongoose = require('mongoose')

const OTPRequestsSchema = mongoose.Schema({
    email: {
        type: String
    },
    code: {
        type: Number
    },
    type: {
        type: String
    },
    createdAt: {
        type: Number
    },
    valid: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('OTPRequests', OTPRequestsSchema, 'OTPRequests')
