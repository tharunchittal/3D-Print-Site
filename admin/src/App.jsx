import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={(t) => {
                setToken(t);
                localStorage.setItem('adminToken', t);
              }} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} onLogout={() => {
                setToken(null);
                localStorage.removeItem('adminToken');
              }} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
