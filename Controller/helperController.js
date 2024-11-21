// services/mealService.js
const axios = require('axios');
const Meal = require('../Models/Meal');

async function fetchAndSaveMeals(ingredients) {
    console.log('Inside fetchAndSaveMeals : ', fetchAndSaveMeals)
    for (const ingredient of ingredients) {
        try {
            // Call the API with the ingredient
            const response = await axios.get(`https://www.themealdb.com/api/json/v2/9973533/filter.php?i=${ingredient}`);
            const meals = response.data.meals;

            // If meals are found, save them to the database
            if (meals && meals.length > 0) {
                for (const meal of meals) {
                    const { strMeal, strMealThumb, idMeal } = meal;

                    await Meal.updateOne(
                        { idMeal },
                        { strMeal, strMealThumb, idMeal },
                        { upsert: true }
                    );
                }
                console.log(`Saved meals for ingredient: ${ingredient}`);
            } else {
                console.log(`No meals found for ingredient: ${ingredient}`);
            }
        } catch (error) {
            console.error(`Error fetching meals for ingredient ${ingredient}:`, error.message);
        }
    }
}

// const ingredients = ['onion', 'garlic', 'chicken', 'tomato', 'beef'];
// const ingredients = ['pork', 'mushroom', 'carrot', 'potato', 'spinach'];
// fetchAndSaveMeals(ingredients)

const API_URL = 'https://www.themealdb.com/api/json/v2/9973533';

const storeMealDetails = async () => {
    try {
        // Step 1: Retrieve all meals from the database
        const meals = await Meal.find();
        console.log('Meals found in database:', meals.length);

        for (const meal of meals) {
            const { idMeal } = meal;

            try {
                // Step 2: Fetch detailed information for each meal
                const response = await axios.get(`${API_URL}/lookup.php?i=${idMeal}`);
                const mealDetail = response.data.meals[0];

                if (mealDetail) {
                    // Step 3: Update the meal in the database with the full details
                    await Meal.updateOne(
                        { idMeal: mealDetail.idMeal },
                        { mealDetails: mealDetail }, // Save the entire meal detail object under `mealDetails`
                        { upsert: true } // Insert if the meal does not exist
                    );

                    console.log(`Updated details for meal: ${mealDetail.strMeal} (ID: ${idMeal})`);
                } else {
                    console.log(`No details found for meal ID: ${idMeal}`);
                }
            } catch (error) {
                console.error(`Error fetching details for meal ID ${idMeal}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Error retrieving meals from database:', error.message);
    }
};
const extractIngredients = async () => {
    try {
        // Retrieve all meals from the database
        const meals = await Meal.find();
        console.log('Processing meals to extract ingredients...');

        for (const meal of meals) {
            const mealDetails = meal.mealDetails;

            if (mealDetails) {
                // Extract ingredients from `strIngredient1` to `strIngredient20`
                const ingredients = [];

                for (let i = 1; i <= 20; i++) {
                    const ingredient = mealDetails[`strIngredient${i}`];
                    if (ingredient && typeof ingredient === 'string' && ingredient.trim() !== '') {
                        ingredients.push(ingredient.trim());
                    }
                }

                // Update the meal in the database with the ingredients array
                await Meal.updateOne(
                    { _id: meal._id }, // Match by document ID
                    { $set: { ingredients } } // Store ingredients array
                );

                console.log(`Ingredients extracted for meal: ${mealDetails.strMeal} (ID: ${meal.idMeal})`);
            } else {
                console.log(`No details found for meal ID: ${meal.idMeal}`);
            }
        }

        console.log('Ingredient extraction completed for all meals.');
    } catch (error) {
        console.error('Error extracting ingredients:', error.message);
    }
};

const getAllUniqueIngredients = async () => {
    try {
        // Step 1: Retrieve all meals from the database
        const meals = await Meal.find();
        console.log('Processing meals to collect unique ingredients...');

        // Step 2: Collect ingredients from each meal and add to a Set for uniqueness
        const ingredientSet = new Set();

        for (const meal of meals) {
            const ingredients = meal.ingredients;

            if (ingredients && Array.isArray(ingredients)) {
                ingredients.forEach((ingredient) => {
                    if (ingredient && typeof ingredient === 'string' && ingredient.trim() !== '') {
                        ingredientSet.add(ingredient.trim());
                    }
                });
            }
        }

        // Step 3: Convert the Set to an Array and log it
        const uniqueIngredients = Array.from(ingredientSet);
        console.log('All unique ingredients:', uniqueIngredients);

        return uniqueIngredients;
    } catch (error) {
        console.error('Error collecting unique ingredients:', error.message);
        return [];
    }
};
