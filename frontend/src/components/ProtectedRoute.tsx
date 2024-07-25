// src/components/ProtectedRoute.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { openModal } = useModal();
  const hasOpenedModal = useRef(false);

  useEffect(() => {
    if (!user && !hasOpenedModal.current) {
      openModal(<LoginForm />);
      hasOpenedModal.current = true;
    }
  }, [user]);

  if (!user) {
    // Return null or a loading indicator while waiting for the user to log in
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;