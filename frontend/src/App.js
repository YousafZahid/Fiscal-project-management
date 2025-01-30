import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Signup from "./components/authentication/signup";
import Login from "./components/authentication/login";
import Dashboard from "./components/dashboard/dashboard";
import ProtectedRoute from "./components/common/protectedroute";
import Home from "./pages/home";
import EmergencySavings from "./components/dashboard/emergencysavings";
import ExpenseTracking from "./components/dashboard/expensetracking";

function App() {
  return (
    <Router>
      <div>
     
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
        <Route
            path="/emergencysavings"
            element={
              <ProtectedRoute>
                <EmergencySavings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expencetracking"
            element={
              <ProtectedRoute>
                <ExpenseTracking />
              </ProtectedRoute>
            }
          />
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
