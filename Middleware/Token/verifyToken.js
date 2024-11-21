/* eslint-disable dot-notation */

require('dotenv').config()
const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        try {
            const decode = jwt.verify(bearerToken, process.env.TOKEN_KEY)
            if (decode) {
                next()
            } else {
                res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } })
            }
        } catch (e) {
            res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } })
        }
    } else {
        res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token' } })
    }
}

module.exports = { verifyToken }
