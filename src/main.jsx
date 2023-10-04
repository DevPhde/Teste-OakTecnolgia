import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './Pages/ErrorPage';
import Home from './Pages/Home';
import Index from './Index';
import Header from './Components/Header';
import Footer from './Components/Footer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: [<Header model="default" />, <ErrorPage/>, <Footer/>],
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
