import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);

    // Listen for storage changes to sync user state when token is cleared
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        const user = authService.getCurrentUser();
        setUser(user);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event when token is cleared programmatically
    const handleTokenCleared = () => {
      setUser(null);
    };
    
    window.addEventListener('tokenCleared', handleTokenCleared);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenCleared', handleTokenCleared);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

