const router = require('express').Router()
const testController = require('../Controller/testController')

router.get('/api/test', testController.getTest)

module.exports = router
