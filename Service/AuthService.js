// services/AuthService.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { USER_ROLES_LIST } = require('../Enumeration/userRoles');

const allowedRoles = USER_ROLES_LIST

class AuthService {
    static generateToken(payload, expiresIn = '1h') {
        return jwt.sign(payload, process.env.JWT_TOKEN_KEY, { expiresIn });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_TOKEN_KEY);
        } catch (error) {
            return null;
        }
    }

    static authMiddleware(roles = allowedRoles) {
        return (req, res, next) => {
            res.setHeader('Content-Type', 'application/json');
            const bearerHeader = req.headers.authorization;

            if (bearerHeader) {
                const bearerToken = bearerHeader.split(' ')[1];
                const decoded = AuthService.verifyToken(bearerToken);

                if (decoded && roles.includes(decoded.role)) {
                    req.user = decoded;
                    next();
                } else {
                    res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Invalid Token or Role' } });
                }
            } else {
                res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Token is required' } });
            }
        };
    }

    static async hasRole(role) {
        return (req, res, next) => {
            if (req.user && req.user.role === role) {
                next();
            } else {
                res.status(403).json({ status: 403, message: 'Forbidden', data: { info: 'Access Denied' } });
            }
        };
    }
}

// Route accessible by 'admin' role only
// router.get('/staff-route', AuthService.authMiddleware(['admin']), (req, res) => {
//     res.json({ message: 'Welcome, Staff!', user: req.user });
// });

module.exports = AuthService;
