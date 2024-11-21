const router = require('express').Router()
const mealController = require('../Controller/mealController')
const helperController = require('../Controller/helperController')

router.get('/api/v1/inventory', mealController.getInventoryOfUser)
router.post('/api/v1/inventory', mealController.addInventoryOfUser)
router.put('/api/v1/inventory/:id', mealController.updateInventoryOfUser)
router.delete('/api/v1/inventory/:id', mealController.deleteInventoryItemOfUser)

router.get('/api/v1/ingredients-list', mealController.getIngredientsList)

router.get('/api/v1/user-meals', mealController.getUserMeals)

module.exports = router
