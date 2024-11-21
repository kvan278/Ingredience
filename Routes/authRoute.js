const router = require('express').Router()
const authController = require('../Controller/authController')

// Auth
router.get('/api/v1/auth/users', authController.getUsersList)
router.post('/api/v1/auth/login', authController.loginHandler)
router.post('/api/v1/auth/signup', authController.signupv1)
router.post('/api/v2/auth/signup', authController.signupv2)
router.post('/api/v1/auth/firebase', authController.handleFirebaseAuth)
router.delete('/api/v1/auth/users/:uid', authController.deleteUser)

// Auth Operations
router.post('/api/v1/auth-ops/otp', authController.sendOtpToEmail)
router.post('/api/v1/auth-ops/forgot-password', authController.sendForgotPasswordLinkToMail)
router.post('/api/v1/auth-ops/new-password', authController.setNewPassword)
router.post('/api/v1/auth-ops/reset-password', authController.resetPassword)
router.post('/api/v2/auth-ops/reset-password', authController.resetPasswordV2)
router.post('/api/v1/auth-ops/account-settings', authController.handleUserAccount)
router.put('/api/v1/auth-ops/assign-role', authController.assignRole)

// Dashboard Auth
router.post('/api/v1/dash-auth/login', authController.handleDashboardLogin)

// Verified
router.post('/api/v2/auth/login', authController.loginHandlerV2)
router.get('/api/v1/auth-ops/verify-account', authController.markAccountAsVerified)

module.exports = router
