import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { getCartItemCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const itemCount = getCartItemCount();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
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

