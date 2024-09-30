import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TrendingPage from './components/TrendingPage';
import ContentCreatePage from './components/ContentCreatePage';
import VideoEditingPage from './components/VideoEditingPage';
import Scraping from './components/Scraping'; 
import RegisterPage from './components/RegisterPage';  // 确保路径正确
import ResetPasswordPage from './components/ResetPasswordPage'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trending"
          element={isAuthenticated ? <TrendingPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/content-create"
          element={isAuthenticated ? <ContentCreatePage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/scraping"
          element={isAuthenticated ? <Scraping setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/video-editing"
          element={isAuthenticated ? <VideoEditingPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
