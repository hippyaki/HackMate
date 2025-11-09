import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginPage from "./components/authentication/LoginPage";
import SwipeRecords from "./components/main/swiperecords";

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/swipe"
          element={
            <ProtectedRoute user={user}>
              <SwipeRecords />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={user ? <Navigate to="/swipe" /> : <LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
