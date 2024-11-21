import { useState, useEffect } from 'react';
import { FaPlusCircle, FaMinusCircle, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/Constants';
import { INGREDIENTS } from '../data/Ingredients';

const CATEGORY_OPTIONS = ['Dairy', 'Meat', 'Produce', 'Seasoning', 'Others'];

const Inventory = () => {
    const navigate = useNavigate();
    const uid = localStorage.getItem('uid');
    const [inventory, setInventory] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    // Fetch inventory items from the API
    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/inventory`, { params: { uid } });
            setInventory(response.data.data.inventory);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        }
    };

    // Fetch ingredients list from the API
    const fetchIngredients = async () => {
        try {
            setIngredients(INGREDIENTS);
        } catch (error) {
            console.error("Failed to fetch ingredients:", error);
        }
    };

    useEffect(() => {
        fetchInventory();
        fetchIngredients();
    }, []);

    // Function to add a new item to the inventory
    const addItemToInventory = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Add New Inventory Item',
            html: `
                <select id="ingredient" class="swal2-input">
                    <option value="">Select Ingredient</option>
                    ${ingredients.map((ingredient) => `<option value="${ingredient}">${ingredient}</option>`).join('')}
                </select>
                <select id="category" class="swal2-input">
                    <option value="">Select Category</option>
                    ${CATEGORY_OPTIONS.map((category) => `<option value="${category}">${category}</option>`).join('')}
                </select>
                <input type="number" id="quantity" class="swal2-input" placeholder="Quantity">
                <input type="number" id="threshold" class="swal2-input" placeholder="Threshold">
                <input type="date" id="expiration" class="swal2-input" placeholder="Expiration Date">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const selectedIngredient = document.getElementById('ingredient').value;
                const selectedCategory = document.getElementById('category').value;
                return {
                    name: selectedIngredient || "Unnamed Item",
                    category: selectedCategory || "Others",
                    quantity: parseInt(document.getElementById('quantity').value),
                    threshold: parseInt(document.getElementById('threshold').value),
                    expiration: dayjs(document.getElementById('expiration').value).valueOf(),
                };
            },
        });

        if (formValues) {
            try {
                const newItem = { ...formValues, uid };
                const response = await axios.post(`${BASE_URL}/api/v1/inventory`, newItem);
                setInventory((prev) => [...prev, response.data.data.inventory]);

                Swal.fire({
                    icon: 'success',
                    title: 'Item Added',
                    text: `${newItem.name} has been added to your inventory.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Failed to add item:", error);
            }
        }
    };

    const increaseQuantity = async (id) => {
        const updatedItem = inventory.find((item) => item._id === id);
        if (!updatedItem) return;

        const updatedData = {
            name: updatedItem.name,
            category: updatedItem.category,
            quantity: updatedItem.quantity + 1,
            threshold: updatedItem.threshold,
            expiration: dayjs().add(7, 'day').valueOf(),
        };

        try {
            await axios.put(`${BASE_URL}/api/v1/inventory/${id}`, updatedData);
            setInventory((prev) =>
                prev.map((item) => (item._id === id ? { ...item, ...updatedData } : item))
            );

            Swal.fire({
                icon: 'success',
                title: 'Quantity Increased',
                text: `${updatedItem.name}'s quantity has been increased.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };

    const decreaseQuantity = async (id) => {
        const updatedItem = inventory.find((item) => item._id === id && item.quantity > 0);
        if (!updatedItem) return;

        const updatedData = {
            name: updatedItem.name,
            category: updatedItem.category,
            quantity: updatedItem.quantity - 1,
            threshold: updatedItem.threshold,
            expiration: updatedItem.expiration,
        };

        try {
            await axios.put(`${BASE_URL}/api/v1/inventory/${id}`, updatedData);
            setInventory((prev) =>
                prev.map((item) => (item._id === id ? { ...item, quantity: item.quantity - 1 } : item))
            );

            Swal.fire({
                icon: 'success',
                title: 'Quantity Decreased',
                text: `${updatedItem.name}'s quantity has been decreased.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to update item:", error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/v1/inventory/${id}`);
            setInventory((prev) => prev.filter((item) => item._id !== id));

            Swal.fire({
                icon: 'success',
                title: 'Item Deleted',
                text: 'The item has been deleted from the inventory.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen relative"
            style={{
                backgroundImage: `url('/pantry.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                filter: 'brightness(95%)',
                opacity: 0.85,
            }}>
            <h2 className="text-3xl font-bold mb-8 border-2 p-3 bg-primary text-white rounded-2xl">
                Inventory
            </h2>
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Category</th>
                            <th className="py-3 px-6 text-left">Expiration</th>
                            <th className="py-3 px-6 text-left">Threshold</th>
                            <th className="py-3 px-6 text-left">Quantity</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {inventory.map((item) => (
                            <tr key={item._id} className="border-b">
                                <td className="py-3 px-6">{item.name}</td>
                                <td className="py-3 px-6">{item.category}</td>
                                <td className="py-3 px-6">{dayjs(item.expiration).format('YYYY-MM-DD')}</td>
                                <td className="py-3 px-6">{item.threshold}</td>
                                <td className="py-3 px-6">{item.quantity}</td>
                                <td className="py-3 px-6 flex items-center justify-center space-x-4">
                                    <FaPlusCircle
                                        onClick={() => increaseQuantity(item._id)}
                                        className="cursor-pointer text-green-500 hover:text-green-600 text-xl"
                                    />
                                    <FaMinusCircle
                                        onClick={() => decreaseQuantity(item._id)}
                                        className="cursor-pointer text-red-500 hover:text-red-600 text-xl"
                                    />
                                    <FaTrash
                                        onClick={() => deleteItem(item._id)}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 text-xl"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='flex flex-row gap-4'>
                <button
                    onClick={addItemToInventory}
                    className="mt-8 px-6 py-3 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                    <FaPlus className="text-2xl" />
                </button>
            </div>

            <div className='flex flex-row gap-4'>
                <button
                    onClick={() => navigate('/shopping-list')}
                    className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                    Shopping List
                </button>
                <button
                    onClick={() => navigate('/home')}
                    className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                    Show Recipes
                </button>
            </div>

        </div>
    );
};

export default Inventory;
