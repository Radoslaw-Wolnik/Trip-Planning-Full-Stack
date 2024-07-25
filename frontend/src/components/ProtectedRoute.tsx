// src/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { openModal } = useModal();
  
  useEffect(() => {
    if (!user) {
      openModal(<LoginForm />);
    }
  }, [user, openModal]);

  if (!user) {
    // Return null or a loading indicator while waiting for the user to log in
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;