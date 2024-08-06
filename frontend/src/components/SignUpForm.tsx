// src/components/SignUpForm.tsx
import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import { ApiError } from '../services/api';

const SignUpForm: React.FC = () => {
  const [userData, setUserData] = useState({email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
//const navigate = useNavigate();
  const { register } = useAuth();
  const { closeModal } = useModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const message = await register(userData.email, userData.username, userData.password);
      setSuccessMessage(message);
      // Optionally close the modal after a delay
      setTimeout(() => closeModal(), 3000);
      // navigate('/trips'); // Redirect to trips page after successful registration
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;