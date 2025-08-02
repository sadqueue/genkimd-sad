import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "./firebaseConfig";

function ForgotPassword() {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
        />
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Reset Email
        </button>

        {message && (
          <p className="text-green-600 text-sm text-center mt-4">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
