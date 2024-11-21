import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/Constants';

const MealSearch = () => {
    const [ingredient, setIngredient] = useState('');
    const [meals, setMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const navigate = useNavigate();

    // Fetch all meals from the API on mount
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const cachedMeals = JSON.parse(localStorage.getItem('userMeals'));
                if (cachedMeals && cachedMeals.length > 0) {
                    setAllMeals(cachedMeals);
                    setMeals(cachedMeals);
                }
                const response = await axios.get(`${BASE_URL}/api/v1/user-meals?uid=${localStorage.getItem('uid')}`);
                const fetchedMeals = response.data.data.meals;

                // Update cache with fresh data
                localStorage.setItem('userMeals', JSON.stringify(fetchedMeals));
                setAllMeals(fetchedMeals);
                setMeals(fetchedMeals);
            } catch (error) {
                console.error("Failed to fetch meals:", error);
            }
        };

        fetchMeals();
    }, []);

    // Search handler to filter meals by name
    const handleSearch = (searchTerm) => {
        setIngredient(searchTerm);
        const filteredMeals = allMeals.filter((meal) =>
            meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMeals(filteredMeals);
    };

    const onSelectMeal = (meal_id) => {
        navigate(`/meal?id=${meal_id}`);
    };

    return (
        <div
            className="flex flex-col items-center p-6 bg-gray-100 min-h-screen"
            style={{
                backgroundImage: `url('/main_bg_2.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                filter: 'brightness(95%)',
                opacity: 0.85,
            }}
        >
            <h2 className="text-3xl font-bold mb-8 border-2 p-2 bg-primary text-white rounded-2xl">
                My Recipes
            </h2>

            <div className="flex w-full max-w-4xl mb-6">
                <input
                    type="text"
                    placeholder="Enter meal name"
                    value={ingredient}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={() => handleSearch(ingredient)}
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-r-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    Search
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {meals.map((meal) => (
                    <div
                        key={meal.idMeal}
                        onClick={() => onSelectMeal(meal.idMeal)}
                        className="cursor-pointer transform transition-transform hover:scale-105 rounded-lg shadow-lg overflow-hidden bg-white"
                    >
                        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover border-2" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">{meal.strMeal}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default MealSearch;
