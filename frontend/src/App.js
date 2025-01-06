import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Signup from "./components/authentication/signup";
import Login from "./components/authentication/login";
import Dashboard from "./components/dashboard/dashboard";
import ProtectedRoute from "./components/common/protectedroute";
import Home from "./pages/home";
function App() {
  return (
    <Router>
      <div>
        <h1>Welcome to My Django & React App</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
