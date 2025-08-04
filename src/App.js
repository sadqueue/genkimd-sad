import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import SadqDashboard from "./SadqDashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SadqDashboard user={user} />} />
      <Route path="/sadq" element={<SadqDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
