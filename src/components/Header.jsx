import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useDarkMode } from '../context/DarkModeContext'
import { ShoppingCart, User, Moon, Sun, LogOut, History } from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* ---------- Logo ---------- */}
            <Link to="/" className="text-2xl font-bold text-[hsl(var(--foreground))] hover:text-[hsl(var(--ocean-blue))] transition-all duration-300 flex items-center space-x-2 tilt-hover fade-in">
              <span className="text-3xl">🌊</span>
              <span>CherishIndia</span>
            </Link>

          {/* ---------- Navigation ---------- */}
            <nav className="hidden md:flex space-x-8 fade-in">
            <Link 
              to="/" 
              className="font-medium text-gray-800 dark:text-gray-100 hover:text-[#0077B6] transition-all duration-300 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0077B6] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link 
              to="/products" 
              className="font-medium text-gray-800 dark:text-gray-100 hover:text-[#0077B6] transition-all duration-300 relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0077B6] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="font-medium text-gray-800 dark:text-gray-100 hover:text-[#0077B6] transition-all duration-300 relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0077B6] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* ---------- Right Section (Icons + Auth) ---------- */}
          <div className="flex items-center space-x-6">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode 
                ? <Sun size={20} className="text-yellow-400" /> 
                : <Moon size={20} className="text-gray-700" />
              }
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 group"
            >
              <ShoppingCart size={20} className="text-gray-800 dark:text-gray-100 group-hover:scale-110 transition-transform" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0077B6] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Orders */}
            <Link 
              to="/orders" 
              className="relative p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 group" 
              title="My Orders"
            >
              <History size={20} className="text-gray-800 dark:text-gray-100 group-hover:scale-110 transition-transform" />
            </Link>

            {/* ---------- User Section ---------- */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 group"
                  title="My Profile"
                >
                  <User size={20} className="text-gray-800 dark:text-gray-100 group-hover:scale-110 transition-transform" />
                </Link>
                <span className="hidden md:inline font-medium text-gray-700 dark:text-gray-200">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut size={20} className="text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-gray-100 bg-gradient-to-r from-[#90DBF4] to-[#0077B6] rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium text-gray-100 bg-gradient-to-r from-[#0077B6] to-[#90DBF4] rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
