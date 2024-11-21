import { useNavigate, useLocation } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUser, FaQuestionCircle } from 'react-icons/fa';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show the header if the current path is "/"
    if (location.pathname === '/') return null;

    return (
        <div
            className="flex items-center justify-between p-3 shadow-md"
            style={{ backgroundColor: 'rgb(41, 175, 80)' }}
        >
            {/* Logo and Title */}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/home')}
            >
                <img
                    src={'/main_logo.png'}
                    alt="Logo"
                    className="w-10 bg-white rounded-full h-8 mr-2 object-contain"
                />
                <h1 className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-white">
                    Ingredience
                </h1>
            </div>

            {/* Navigation links */}
            <div className="flex space-x-4 md:space-x-10">
                <button
                    onClick={() => navigate('/inventory')}
                    className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300 flex flex-col items-center"
                    title="Inventory"
                >
                    <FaBox className="text-lg md:text-2xl" />
                    <span className="text-xs md:text-sm mt-1">Inventory</span>
                </button>
                <button
                    onClick={() => navigate('/shopping-list')}
                    className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300 flex flex-col items-center"
                    title="Shopping List"
                >
                    <FaShoppingCart className="text-lg md:text-2xl" />
                    <span className="text-xs md:text-sm mt-1">Shopping</span>
                </button>
                <button
                    onClick={() => navigate('/help')}
                    className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300 flex flex-col items-center"
                    title="Help"
                >
                    <FaQuestionCircle className="text-lg md:text-2xl" />
                    <span className="text-xs md:text-sm mt-1">Help</span>
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300 flex flex-col items-center"
                    title="Profile"
                >
                    <FaUser className="text-lg md:text-2xl" />
                    <span className="text-xs md:text-sm mt-1">Profile</span>
                </button>
            </div>
        </div>
    );
}

export default Header;
