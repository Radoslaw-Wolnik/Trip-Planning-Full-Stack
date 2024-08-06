
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPageLayout from './layouts/LandingPageLayout'

import Home from './pages/Home';
import About from './pages/About';
import MainFunction from './pages/MainFunction';
import VerifyEmail from './pages/VerifyEmail';

import TripList from './pages/TripListPage';
import TripDetail from './pages/TripDetail';
import Profile from './pages/Profile';
import SharedTripView from './pages/SharedTripView';

import ProtectedRoute from './components/ProtectedRoute';

import './style/All.css'
import './style/Modal.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/main', element: <MainFunction /> },
      { path: '/verify-email/:token', element: <VerifyEmail /> },
      { 
        path: '/trips', 
        element: <ProtectedRoute><TripList /></ProtectedRoute> 
      },
      { 
        path: '/trip/:id', 
        element: <ProtectedRoute><TripDetail /></ProtectedRoute> 
      },
      { 
        path: '/shared-trip/:shareCode', 
        element: <SharedTripView /> 
      },
      {
        path: '/profile/:userId?',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      }
    ],
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
