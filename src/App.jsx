import './App.css';
import LoginForm from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import TaskManager from './components/TaskManager';

function App() {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lastActive', Date.now().toString());
    const checkAutoLogout = () => {
      const lastActive = localStorage.getItem('lastActive');
      if (lastActive) {
        const timeElapsed = Date.now() - parseInt(lastActive, 10);
        const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        if (timeElapsed > twoHours) {
          logoutUser();
        }
      }
    };

    checkAutoLogout();
    const interval = setInterval(checkAutoLogout, 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActive');
    window.location.reload();
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              localStorage.getItem("token") ? <Navigate to="/dashboard" /> : <LoginForm />
            }
          />
          <Route
            path="/register"
            element={
              localStorage.getItem("token") ? <Navigate to="/dashboard" /> : <Register />
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/taskManager" element={<ProtectedRoute><TaskManager /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />

    </div>
  );
}

export default App;

