// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

//interface HeaderProps {
//  openModal: (newContent: ModalContent) => void;
//}

//const Header: React.FC<HeaderProps> = ({ openModal }) => {
const Header: React.FC = () => {
  const { openModal } = useModal();
  const { user, logout } = useAuth();

  const handleOpenLogin = () => {
    openModal(<LoginForm />);
  };

  const handleOpenSignUp = () => {
    openModal(<SignUpForm />);
  };

  return (
    <div className='navbar'>
      <Link to='/'>
        <h4>Home</h4>
      </Link>
      <Link to='/About'>
        <h4>About</h4>
      </Link>
      <Link to='/Main'>
        <h4>Main Function</h4>
      </Link>
      {user ? (
        <>
          <span>Welcome, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={handleOpenLogin}>Login</button>
          <button onClick={handleOpenSignUp}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default Header;