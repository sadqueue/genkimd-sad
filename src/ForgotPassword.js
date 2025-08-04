import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const auth = getAuth();
    try {
        const resetUrl =
          window.location.hostname === "localhost"
            ? "http://localhost:3000/login" // or "/login" if you're using React Router
            : "https://genkimd.com/login";
      
        await sendPasswordResetEmail(auth, email, {
          url: resetUrl,
          handleCodeInApp: false,
        });
      
        setMessage("✅ Password reset email sent! Please check your inbox.");
      } catch (err) {
        setError("❌ Error: " + err.message);
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleReset}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter your email:
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 mb-4 border rounded shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <p className="mt-4 text-center text-sm text-blue-600">
            <a href="/login" className="hover:underline">
                ← Back to Login
            </a>
            </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
