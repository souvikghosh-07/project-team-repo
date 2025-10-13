// frontend/src/App.js

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// CRITICAL: We import AuthContext using curly braces {} because it's a named export.
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  // CRITICAL: We consume the context here.
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;