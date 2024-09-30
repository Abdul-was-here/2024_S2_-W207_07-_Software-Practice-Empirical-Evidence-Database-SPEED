import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; 
import Analysis from './components/Analysis';
import Articles from './components/Articles';
import Bookmarks from './components/Bookmarks';
import Home from './components/Home'; // This is the index page
import Moderation from './components/Moderation';
import Register from './components/Register';
import Search from './components/Search';
import Submit from './components/Submit'; // Make sure all paths are correct

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
