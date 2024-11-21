import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from '../api/Constants';

const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState([]);

    // Load shopping list from API and local storage on mount
    useEffect(() => {
        const fetchShoppingList = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/inventory?threshold=true&uid=${localStorage.getItem('uid')}`);
                const apiItems = response.data.data.inventory;
                const localItems = JSON.parse(localStorage.getItem('shoppingList')) || [];
                setShoppingList([...apiItems, ...localItems]);
            } catch (error) {
                console.error('Failed to fetch shopping list:', error);
            }
        };
        fetchShoppingList();
    }, []);

    // Save shopping list to local storage
    const saveToLocalStorage = (list) => {
        const localItems = list.filter(item => !item._id); // Only store items without `_id` in local storage
        localStorage.setItem('shoppingList', JSON.stringify(localItems));
    };

    // Handle purchase action
    const handlePurchase = (itemId) => {
        const purchasedItem = shoppingList.find((item) => item._id === itemId || item.id === itemId);
        if (!purchasedItem) return;

        Swal.fire({
            icon: 'success',
            title: 'Item Purchased!',
            text: `${purchasedItem.name} has been added to your inventory.`,
            showConfirmButton: false,
            timer: 1500,
        });

        const updatedList = shoppingList.filter((item) => item._id !== itemId && item.id !== itemId);
        setShoppingList(updatedList);
        saveToLocalStorage(updatedList);

        console.log(`Purchased item: ${purchasedItem.name}`);
    };

    // Handle remove action
    const handleRemove = (itemId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to remove this item from the shopping list?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedList = shoppingList.filter((item) => item._id !== itemId && item.id !== itemId);
                setShoppingList(updatedList);
                saveToLocalStorage(updatedList);
                Swal.fire('Removed!', 'The item has been removed from your shopping list.', 'success');
            }
        });
    };

    // Handle add new item
    const handleAddItem = () => {
        Swal.fire({
            title: 'Add New Item',
            input: 'text',
            inputLabel: 'Item Name',
            showCancelButton: true,
            confirmButtonText: 'Add',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a valid item name!';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const newItem = {
                    id: Date.now(), // Temporary ID for local usage
                    name: result.value,
                    category: 'General', // Default category
                };

                const updatedList = [...shoppingList, newItem];
                setShoppingList(updatedList);
                saveToLocalStorage(updatedList);

                Swal.fire('Added!', `${newItem.name} has been added to your shopping list.`, 'success');
            }
        });
    };

    return (
        <div className="relative flex flex-col items-center p-6 bg-gray-100 min-h-screen"
            style={{
                backgroundImage: `url('/shoplist.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                filter: 'brightness(95%)',
                opacity: 0.85,
            }}>
            <h2 className="text-3xl font-bold mb-8 border-2 p-3 bg-primary text-white rounded-2xl">
                Shopping List
            </h2>

            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Category</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {shoppingList.map((item) => (
                            <tr key={item._id || item.id} className="border-b">
                                <td className="py-3 px-6">{item.name}</td>
                                <td className="py-3 px-6">{item.category}</td>
                                <td className="py-3 px-6 flex items-center justify-center space-x-4">
                                    <FaShoppingCart
                                        onClick={() => handlePurchase(item._id || item.id)}
                                        className="cursor-pointer text-primary hover:text-opacity-80 text-xl"
                                        title="Purchase"
                                    />
                                    <FaTrash
                                        onClick={() => handleRemove(item._id || item.id)}
                                        className="cursor-pointer text-red-500 hover:text-red-600 text-xl"
                                        title="Remove"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='flex flex-row gap-4'>
                {/* Floating Action Button */}
                <button
                    onClick={handleAddItem}
                    className="mt-8 px-6 py-3 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 hover:scale-105"
                    title="Add Item"
                >
                    <FaPlus className="text-2xl" />
                </button>
            </div>
        </div>
    );
};

export default ShoppingList;