import React, { useState, useEffect } from 'react';
import {
    Sun,
    Moon,
    Menu,
    X,
    Code2,
    BookOpenCheck,
    User,
    LogIn,
    UserPlus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  // Check auth state directly from localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

    const { isDark, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Playground', icon: <Code2 size={18} />, href: '/playground' },
        { name: 'Problems', icon: <BookOpenCheck size={18} />, href: '/problems' },
        { name: 'Profile', icon: <User size={18} />, href: '/profile' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section matching image_d99aa3.png */}
                    <div className="shrink-0 flex items-center cursor-pointer">
                        <a href='/'>
                            <span className="text-2xl font-bold font-sans tracking-tight">
                                <span className="text-blue-600 dark:text-blue-500">Exec</span>
                                <span className="text-black dark:text-white">utr</span>
                            </span>
                        </a>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                {link.icon}
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Right Side (Theme + Auth) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/auth" >
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <LogIn size={16} />
                                        Login
                                    </button>
                                </Link>
                                <Link to="/auth" >
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                                        <UserPlus size={16} />
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

{/* TODO: FIX UI BUg when use link to go different page mobile menu not closed */}
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-4 space-y-1 shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            {link.icon}
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/auth" >
                                    <button className="flex items-center justify-center gap-2 w-full px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        <LogIn size={18} />
                                        Login
                                    </button>
                                </Link>
                                <Link to="/auth" >
                                    <button className="flex items-center justify-center gap-2 w-full px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                        <UserPlus size={18} />
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-base font-medium text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;