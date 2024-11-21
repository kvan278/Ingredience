import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BASE_URL } from '../api/Constants';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', email: '', dietaryRestriction: '' });

    // Random color generator for avatar background
    const getRandomColor = () => {
        const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const avatarBgColor = getRandomColor();

    // Fetch user data from localStorage
    useEffect(() => {
        const username = localStorage.getItem('username') || 'User';
        const email = localStorage.getItem('email') || 'user@example.com';
        const dietaryRestriction = localStorage.getItem('dietaryRestriction') || 'None';
        setUser({ username, email, dietaryRestriction });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('dietaryRestriction');
        console.log('User logged out');
        navigate('/');
    };

    const handleEdit = async (key, currentValue) => {
        const { value: newValue } = await Swal.fire({
            title: `Edit ${key === 'username' ? 'Username' : 'Dietary Restriction'}`,
            input: 'text',
            inputValue: currentValue,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'This field cannot be empty';
                }
            },
        });

        if (newValue) {
            // Call API to update the user profile
            try {
                const uid = localStorage.getItem('uid'); // Assuming 'uid' is stored in localStorage
                const response = await fetch(`${BASE_URL}/api/v1/users/profile-data`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid, key, value: newValue }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                // Update local state and localStorage
                setUser((prev) => ({ ...prev, [key]: newValue }));
                localStorage.setItem(key, newValue);
                Swal.fire('Success', `${key === 'username' ? 'Username' : 'Dietary Restriction'} updated successfully`, 'success');
                // window.location.reload()
            } catch (error) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    };

    return (
        <div className="min-h-screen relative">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url('/main_logo.png')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1300px',
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'calc(50% - 13px) center',
                    filter: 'brightness(95%)',
                    opacity: 0.13, // Adjust transparency for the background
                    zIndex: -1,  // Push background behind content
                }}
            ></div>

            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-xs w-full text-center border border-gray-300">
                    <div
                        className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full mb-4 ${avatarBgColor} text-white text-3xl font-bold`}
                    >
                        {user && user.username.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex justify-center items-center">
                        {user.username}
                        <button
                            onClick={() => handleEdit('username', user.username)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            title="Edit Username"
                        >
                            ✏️
                        </button>
                    </h2>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    <p className="text-gray-500 italic mb-6 flex justify-center items-center">
                        Dietary Restriction: {user.dietaryRestriction}
                        <button
                            onClick={() => handleEdit('dietaryRestriction', user.dietaryRestriction)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            title="Edit Dietary Restriction"
                        >
                            ✏️
                        </button>
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Profile;
