import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser && authService.isLoggedIn()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const userData = authService.getUser();
      setUser(userData);
      return response;
    } catch (err) {
      setError(err.detail || 'Login failed');
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await authService.register(username, email, password);
      return response;
    } catch (err) {
      setError(err.detail || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isLoggedIn: !!user && authService.isLoggedIn(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
