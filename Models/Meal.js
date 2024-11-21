// models/Meal.js
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    strMeal: { type: String, required: true },
    strMealThumb: { type: String, required: true },
    mealDetails: {
        type: Object
    },
    ingredients: {
        type: Array
    },
    idMeal: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Meals', mealSchema, 'Meals')
