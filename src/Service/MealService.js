// src/services/mealService.js
import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v2/9973533/';

// Helper function to store data in localStorage with a cache timestamp
const cacheData = (key, data) => {
    const cacheEntry = {
        timestamp: new Date().getTime(),
        data,
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
};

// Helper function to get cached data if it’s still valid (within 24 hours)
const getCachedData = (key) => {
    const cacheEntry = JSON.parse(localStorage.getItem(key));
    if (!cacheEntry) return null;
    
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (new Date().getTime() - cacheEntry.timestamp < oneDay) {
        return cacheEntry.data;
    } else {
        localStorage.removeItem(key);
        return null;
    }
};

// Fetch meals by ingredient with caching
export const fetchMealsByIngredient = async (ingredient) => {
    const cacheKey = `meals_${ingredient}`;
    const cachedMeals = getCachedData(cacheKey);
    
    if (cachedMeals) {
        console.log('Using cached data for ingredient:', ingredient);
        return cachedMeals;
    }

    try {
        const response = await axios.get(`${API_URL}filter.php?i=${ingredient}`);
        const meals = response.data.meals;
        cacheData(cacheKey, meals); // Cache the fetched data
        return meals;
    } catch (error) {
        console.error("Error fetching meals by ingredient", error);
        return [];
    }
};

// Fetch meal details by ID with caching
export const fetchMealDetails = async (id) => {
    const cacheKey = `mealDetails_${id}`;
    const cachedMeal = getCachedData(cacheKey);
    
    if (cachedMeal) {
        console.log('Using cached data for meal ID:', id);
        return cachedMeal;
    }

    try {
        const response = await axios.get(`${API_URL}lookup.php?i=${id}`);
        const meal = response.data.meals[0];
        cacheData(cacheKey, meal); // Cache the fetched data
        return meal;
    } catch (error) {
        console.error("Error fetching meal details", error);
        return null;
    }
};
