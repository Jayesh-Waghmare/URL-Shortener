import React from 'react'
import HomePage from './pages/HomePage'
import LoginForm from './components/LoginForm'
import AuthPage from './pages/AuthPage'
import { Outlet } from '@tanstack/react-router'
import Navbar from './components/NavBar'

const RootLayout = () => {
  return (
    <div className="bg-[url('/URLShortenerBackGroundImage.png')] bg-cover bg-center min-h-screen">
      <>
        <Navbar/>
        <Outlet/>
      </>
    </div>
  )
}

export default RootLayout