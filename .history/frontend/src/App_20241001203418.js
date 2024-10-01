import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login'; 
import Register from './pages/register';
import Submit from './pages/submit'; // Make sure all paths are correct

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login and Registration */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/submit"
          element={isAuthenticated ? <Submit setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
