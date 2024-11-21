const mongoose = require('mongoose')

const requestLogSchema = mongoose.Schema({
    url: { type: String, required: true },
    method: { type: String, required: true },
    statusCode: { type: Number, required: true },
    ipAddress: {
        type: String,
        default: ''
    },
    requestBody: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Number, default: () => new Date().getTime() }
})

module.exports = mongoose.model('RequestLogs', requestLogSchema, 'RequestLogs')