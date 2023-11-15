import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaEdit } from 'react-icons/fa';

function UserDropdown({ handleLogout, navigate }) { 
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2 flex justify-center items-center transition-colors duration-300">
                <FaUser className="text-icon-lg sm:text-icon-lg md:text-base lg:text-base mr-3 md:mr-5" />
                <span className="hidden md:inline-block">User</span>
            </button>
            </div>
            {isOpen && (
                <div className="origin-left fixed mt-3 -ml-24 md:ml-0 lg:ml-0 xl:ml-0  w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button 
                            onClick={() => navigate('/manageUploads')} 
                            className="w-full flex items-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                            role="menuitem"
                        >
                            <FaEdit className="mr-2 text-gray-400" />
                            Manage uploads
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                            role="menuitem"
                        >
                            <FaSignOutAlt className="mr-2 text-gray-400" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDropdown;
