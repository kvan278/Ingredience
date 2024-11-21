import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Help = () => {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        phone: '',
        description: '',
    });

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleHelpFormSubmit = (e) => {
        e.preventDefault();

        const { name, email, description } = formValues;
        if (!name || !email || !description) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill out all required fields.',
            });
            return;
        }

        console.log('Help Form Data:', formValues);

        // Display a success message
        Swal.fire({
            icon: 'success',
            title: 'Submitted!',
            text: 'Your query has been successfully submitted. Our team will get back to you shortly.',
            timer: 2000,
            showConfirmButton: false,
        });

        // Reset form values
        setFormValues({
            name: '',
            email: '',
            phone: '',
            description: '',
        });
    };

    return (
        <div className="relative flex flex-col items-center p-6 bg-gray-100 min-h-screen"
            style={{
                backgroundImage: `url('/pantry_image2.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                filter: 'brightness(95%)',
                opacity: 0.85,
            }}>
            <h2 className="text-3xl font-bold mb-8 border-2 p-3 bg-primary text-white rounded-2xl">
                Help & Support
            </h2>

            <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700 text-lg mb-6">
                    Need assistance? Fill out the form, and our support team will reach out to you.
                </p>
                <form onSubmit={handleHelpFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your Phone Number"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Describe your issue"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg shadow-md font-semibold hover:bg-primary-dark transition-all duration-300"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Help;
