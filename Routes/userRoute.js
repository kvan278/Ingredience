const router = require('express').Router()
const userController = require('../Controller/userController')

router.get('/api/v1/users/leaderboard', userController.getLeaderboardOfUsers)
router.get('/api/v1/users/profile', userController.getUserProfileData)

// User Data
router.post('/api/v1/users/store-location', userController.saveUserLocation)
router.put('/api/v1/users/profile-data', userController.updateUserProfile)
router.put('/api/v2/users/profile-data', userController.updateUserProfileV2)

router.get('/api/v1/user-ops/search-user', userController.searchUser)

// Contact Us
router.get('/api/v1/user-ops/contact-support', userController.getContactFormsData)
router.post('/api/v1/user-ops/contact-support', userController.submitContactUs)
router.put('/api/v1/user-ops/contact-support/:id', userController.updateContactUs)

module.exports = router
