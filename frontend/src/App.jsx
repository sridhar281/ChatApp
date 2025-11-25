import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Settings from './pages/Settings';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import UseAuthStore from "./store/UseAuthStore";

import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';

const App1 = () => {
  const { authUser, checkAuth, isCheckingAuth,onlineUsers} = UseAuthStore();
  console.log("authuser:", authUser);
  console.log("isCheckingAuth:", isCheckingAuth);
  console.log("onlineUsers:", onlineUsers);
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔥 Apply theme directly to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-grey-500" size={72} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser?<Settings />:<Navigate to="/login"/>} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={authUser ? <NotFoundPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App1;
