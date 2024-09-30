import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login'; 
import Analysis from './pages/analysis';
import Articles from './pages/articles';
import Bookmarks from './pages/bookmarks';
import Home from './src/components/index'; // This is the index page
import Moderation from './pages/moderation';
import Register from './pages/register';
import Search from './pages/search';
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
          path="/analysis"
          element={isAuthenticated ? <Analysis setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/articles"
          element={isAuthenticated ? <Articles setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/bookmarks"
          element={isAuthenticated ? <Bookmarks setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/moderation"
          element={isAuthenticated ? <Moderation setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={isAuthenticated ? <Search setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
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
