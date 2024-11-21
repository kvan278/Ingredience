// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../api/Constants';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [dietaryRestriction, setDietaryRestriction] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, { email, password });
            setMessage("Login successful!");
            const user = response.data.data.user;
            localStorage.setItem('uid', user.uid);
            localStorage.setItem('username', user.username);
            localStorage.setItem('dietaryRestriction', user.dietaryRestriction || 'None');
            localStorage.setItem('email', user.email);
            localStorage.setItem('createdAt', user.createdAt);
            navigate('/home');
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            await axios.post(`${BASE_URL}/api/v2/auth/signup`, { email, password });
            setMessage("Signup successful!");
            localStorage.setItem('username', name);
            localStorage.setItem('dietaryRestriction', dietaryRestriction);
            localStorage.setItem('email', email);
            console.log("User signed up with additional data:", { name, dietaryRestriction });

            setActiveTab('login')
        } catch (err) {
            setError("Signup failed. Please try again.");
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setDietaryRestriction('');
        setError('');
        setMessage('');
    };

    const toggleTab = (tab) => {
        setActiveTab(tab);
        resetForm();
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
                    backgroundPosition: 'calc(50% - 9px) calc(50% - 22px)',
                    opacity: 0.10, // Adjust transparency for the background
                    zIndex: -1,  // Push background behind content
                }}
            ></div>

            <div className="flex items-center justify-center min-h-screen opacity-85">

                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-350">
                    <div className="flex justify-around mb-8">
                        <button
                            onClick={() => toggleTab('login')}
                            className={`text-lg font-semibold ${activeTab === 'login' ? 'text-[#29af50] border-b-2 border-[#29af50]' : 'text-gray-500'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => toggleTab('signup')}
                            className={`text-lg font-semibold ${activeTab === 'signup' ? 'text-[#29af50] border-b-2 border-[#29af50]' : 'text-gray-500'
                                }`}
                        >
                            Signup
                        </button>
                    </div>

                    {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                    <form onSubmit={activeTab === 'login' ? handleLogin : handleSignup} className="space-y-4">
                        {activeTab === 'signup' && (
                            <>
                                <div>
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29af50]"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Dietary Restriction</label>
                                    <input
                                        type="text"
                                        value={dietaryRestriction}
                                        onChange={(e) => setDietaryRestriction(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29af50]"
                                        placeholder="Enter dietary restriction (optional)"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29af50]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29af50]"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {activeTab === 'signup' && (
                            <div>
                                <label className="block text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29af50]"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#29af50] text-white font-semibold py-2 rounded-lg hover:bg-[#29af3c] transition-colors"
                        >
                            {activeTab === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
