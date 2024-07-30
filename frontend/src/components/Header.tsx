// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useModal } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { getFullImageUrl } from '../utils/imageUtils';

//interface HeaderProps {
//  openModal: (newContent: ModalContent) => void;
//}

//const Header: React.FC<HeaderProps> = ({ openModal }) => {
const Header: React.FC = () => {
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const [, setUpdate] = useState({});

  useEffect(() => {
    console.log(user);
    setUpdate({});
  }, [user]);

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
      <Link to='/trips'>
        <h4>Trips</h4>
      </Link>
      <Link to='/profile'>
        <h4>My profile</h4>
      </Link>
      {user ? (
        <div className="user-info">
          <img 
            src={getFullImageUrl(user.profilePicture)} 
            alt={user.username} 
            className="header-profile-picture"
            style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', marginRight: '5px' }}
          />
          <span>Welcome, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
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