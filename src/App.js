import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import SadqDashboard from "./SadqDashboard";
import ForgotPassword from "./ForgotPassword";
import HomePage from "./HomePage"; // Make sure this exists

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />   {/* <-- This is what you're missing */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sadq" element={<SadqDashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
