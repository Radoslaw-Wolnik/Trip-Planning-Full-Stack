
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'

import LandingPageLayout from './layouts/LandingPageLayout'

import Home from './pages/Home'
import About from './pages/About'
import MainFunction from './pages/MainFunction'

import './style/All.css'
import './style/Modal.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/About',
        element: <About />,
      },
      {
        path: '/Main',
        element: <MainFunction />,
      },
    ],
  },
])

const App = () => { return ( <RouterProvider router={router} /> ) }

export default App;
