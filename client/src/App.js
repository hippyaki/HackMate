import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthService from './services/authService';

// Authentication Pages
import LoginPage from "./components/authentication/LoginPage";
import SignUpPage from "./components/authentication/SignUpPage";
import ForgotPasswordPage from "./components/authentication/ForgotPasswordPage";

// SwipeRecords
import SwipeRecords from "./components/main/swiperecords";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = AuthService.getCurrentUser;

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          
          {/* SwipeRecords Route - Protected */}
          <Route 
            path="/swipe" 
            element={
              <ProtectedRoute>
                
                <SwipeRecords />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;