import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { use } from "react";
import { useState } from "react";
import { RiAdminLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, loading } = useSelector(
        (state) => state.auth
    );
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent brand_name">
                                ecofinds
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            to={"/"}
                            className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            to={"/products"}
                            className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                        >
                            Categories
                        </Link>
                        {/* <Link
              to={"/products"}
              className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
            >
              Deals
            </Link> */}
                        <Link
                            to={"/about"}
                            className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                        >
                            About
                        </Link>
                        <Link
                            to={"/contact"}
                            className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* <button className="text-gray-700 hover:text-amber-600 transition-colors duration-200 cursor-pointer">
              <Search className="h-5 w-5" />
            </button> */}
                        <Link
                            to={"/profile"}
                            className="text-gray-700 hover:text-amber-600 transition-colors duration-200"
                        >
                            <User className="h-5 w-5" />
                        </Link>

                        <Link
                            to={"/wishlist"}
                            className="text-gray-700 hover:text-amber-600 transition-colors duration-200"
                        >
                            <Heart className="h-5 w-5" />
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to={"/orders"}
                                className="text-gray-700 hover:text-amber-600 transition-colors duration-200"
                                title="Order History"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </Link>
                        )}
                        <Link
                            to={"/cart"}
                            className="relative text-gray-700 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {user && user.cart
                                    ? user.cart.length
                                    : localStorage.getItem("cart")
                                    ? JSON.parse(localStorage.getItem("cart"))
                                          .length
                                    : 0}
                            </span>
                        </Link>
                        {user && isAuthenticated && (
                            <Link
                                to={"/vendor"}
                                className="relative text-gray-700 hover:text-amber-600 transition-colors duration-200 cursor-pointer"
                                title="Vendor Dashboard"
                            >
                                <RiAdminLine className="h-5.25 w-5.25" />
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden text-gray-700 hover:text-amber-600 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to={"/"}
                                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                to={"/products"}
                                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                            >
                                Categories
                            </Link>
                            {/* <Link
                to={"/products"}
                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
              >
                Deals
              </Link> */}
                            <Link
                                to={"/about"}
                                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                            >
                                About
                            </Link>
                            <Link
                                to={"/contact"}
                                className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium"
                            >
                                Contact
                            </Link>
                            {user && isAuthenticated && (
                                <>
                                    <Link
                                        to={"/orders"}
                                        className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium flex items-center gap-2"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                        Order History
                                    </Link>
                                    <Link
                                        to={"/vendor"}
                                        className="text-gray-700 hover:text-amber-600 transition-colors duration-200 font-medium flex items-center gap-2"
                                    >
                                        <RiAdminLine className="h-4 w-4" />
                                        Vendor Dashboard
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;