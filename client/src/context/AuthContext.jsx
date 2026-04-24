import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if logged in on mount
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // We can verify token by fetching user's org or a generic /me route
          // Since we don't have a specific /me user route, we just trust the token exists 
          // and let the interceptor handle 401s if it's invalid.
          // For a robust app, decode JWT or fetch profile here.
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: payload.sub, org: payload.org, role: payload.role });
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user: userData, tokens } = data.data;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(userData);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    const { user: newUserData, tokens } = data.data;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(newUserData);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', { 
        refreshToken: localStorage.getItem('refreshToken') 
      });
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
