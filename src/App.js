// ✅ App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import SadqDashboard from "./SadqDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sadq" element={<SadqDashboard />} />
    </Routes>
  );
}

export default App;
