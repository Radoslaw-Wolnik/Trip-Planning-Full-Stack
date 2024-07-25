// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { login, register } from '../services/api';

interface AuthContextProps {
  user: any | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const loginUser = async (credentials: { email: string; password: string }) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (userData: { email: string; username: string; password: string }) => {
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, register: registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
