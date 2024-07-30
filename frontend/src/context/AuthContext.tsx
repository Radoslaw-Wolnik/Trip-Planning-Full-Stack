import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe } from '../services/api';
import { FullUser } from '../types';


export interface AuthContextType {
  user: FullUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (updatedUser: FullUser) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiLogin({email, password});
      localStorage.setItem('token', response.data.token);
      await fetchUserData();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [fetchUserData]);

  const register = useCallback(async (email: string, username: string, password: string) => {
    try {
      const response = await apiRegister({ email, username, password });
      //localStorage.setItem('token', response.data.token);

      console.log(response);
      await login(email, password);
      //await fetchUserData();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, [fetchUserData]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const updateCurrentUser = useCallback((updatedUser: FullUser) => {
    setUser(updatedUser);
  }, []);

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};