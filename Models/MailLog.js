const mongoose = require('mongoose')

const MailLogsSchema = mongoose.Schema({
    email: {
        type: String
    },
    type: {
        type: String
    },
    createdAt: {
        type: Number
    }
})

module.exports = mongoose.model('MailLogs', MailLogsSchema, 'MailLogs')
