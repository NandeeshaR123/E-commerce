import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { getCartItemCount, fetchCart, cart } = useCart();
  const navigate = useNavigate();
  const [itemCount, setItemCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setItemCount(getCartItemCount());
  }, [cart]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleLogoClick = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
      setShowDropdown(!showDropdown);
    }
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">   
              <Link to="/" className="text-2xl font-bold text-primary-600">
                E-Commerce
              </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-primary-600 transition"
                >
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/products"
                    className="text-gray-700 hover:text-primary-600 transition"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative" ref={dropdownRef}>
                  {isAuthenticated && (
                    <div
                      onClick={handleLogoClick}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 text-white text-lg font-bold cursor-pointer hover:bg-primary-700 transition select-none"
                    >
                      {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                    </div>
                  )}

                  {isAuthenticated && showDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => handleDropdownItemClick('/addresses')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          My Addresses
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick('/orders')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          My Orders
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDropdownItemClick('/admin/products')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                          >
                            Admin Panel
                          </button>
                        )}
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

