// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { login, register, me } from '../services/api';
//import jwtDecode from 'jwt-decode';

interface AuthContextProps {
  user: any | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await me();
      setUser(response.data);
      console.log('fetching data response:', response);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., redirect to login page)
    }
  };

  const loginUser = async (credentials: { email: string; password: string }) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.data.token);

      //const decodedToken = jwtDecode(response.data.token);
      //const userId = decodedToken.user.id;
      //console.log(userId);
      console.log('login response', response);
      await fetchUserData();
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const registerUser = async (userData: { email: string; username: string; password: string }) => {
    console.log(userData);
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.data.token);
      await fetchUserData();
    } catch (error) {
      console.error('Registration error:', error);
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
