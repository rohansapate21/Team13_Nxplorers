import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await axios.get(`${API_BASE_URL}${config.API_ENDPOINTS.USER_PROFILE}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/token/`, {
        username,
        password
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register/`, userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
