const RequestLogModel = require('../Models/RequestLog')

const saveRequestLog = async (url, method, statusCode, requestBody, ipAddress) => {
    try {
        const requestLog = new RequestLogModel({
            url,
            method,
            statusCode,
            requestBody,
            ipAddress,
            createdAt: new Date().getTime()
        })

        await requestLog.save()
    } catch (error) {
        console.error('Error saving request log:', error)
    }
}

const requestLogger = (req, res, next) => {
    const originalEnd = res.end
    res.end = function () {
        const statusCode = res.statusCode || 500
        originalEnd.apply(res, arguments)
        const url = req.url
        const requestBody = req.body || {}
        const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        saveRequestLog(url, req.method, statusCode, requestBody, ipAddress)
    }
    next()
}

module.exports = requestLogger
