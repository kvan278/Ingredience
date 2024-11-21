// src/components/MealDetails.js
import { useEffect, useState } from 'react';
import { fetchMealDetails } from '../Service/MealService';
import { useLocation } from 'react-router-dom';

const MealDetails = () => {
    const location = useLocation();
    const [meal, setMeal] = useState(null);

    // Extract mealId from query parameters
    const mealId = new URLSearchParams(location.search).get('id');

    useEffect(() => {
        const getMealDetails = async () => {
            if (mealId) {
                const details = await fetchMealDetails(mealId);
                setMeal(details);
            }
        };
        getMealDetails();
    }, [mealId]);

    if (!meal) return <p className="text-center text-gray-500 mt-10">Loading meal details...</p>;

    return (
        <div className="flex flex-col items-center p-8 bg-gradient-to-b min-h-screen"
            style={{
                backgroundImage: `url('/main_bg_2.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                filter: 'brightness(95%)',
                opacity: 0.85, // Adjust to make it more or less subtle
            }}>
            <h2 className="text-4xl font-extrabold text-white bg-primary p-4 rounded-2xl mb-8 text-center">{meal.strMeal}</h2>

            {/* Container to align image and details side by side */}
            <div className="flex flex-col lg:flex-row items-start lg:items-start w-full max-w-6xl gap-8">
                {/* Image on the left side */}
                <div className="lg:w-1/3 w-full flex justify-center lg:justify-start">
                    <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="w-full lg:w-120 h-auto object-cover rounded-lg shadow-lg border-2 border-primary-light"
                    />
                </div>

                {/* Details on the right side */}
                <div className="lg:w-2/3 w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-3xl font-semibold text-primary-dark mb-6">Instructions</h3>
                    <p className="text-gray-700 leading-relaxed mb-8 text-lg tracking-wide">{meal.strInstructions}</p>

                    <h3 className="text-3xl font-semibold text-primary-dark mb-6">Ingredients</h3>
                    <ul className="grid grid-cols-2 gap-6 text-gray-800">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
                            const ingredient = meal[`strIngredient${i}`];
                            const measure = meal[`strMeasure${i}`];
                            return ingredient ? (
                                <li key={i} className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg shadow-sm">
                                    <span className="text-primary font-bold">{measure}</span>
                                    <span>{ingredient}</span>
                                </li>
                            ) : null;
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MealDetails;
