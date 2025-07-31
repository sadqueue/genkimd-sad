import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState([false, false, false]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleCheckboxChange = (index) => {
    const updated = [...agreed];
    updated[index] = !updated[index];
    setAgreed(updated);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/sadq");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome to SADQ – Secure Access Portal
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Secure login to protect data and ensure smooth clinical operations.
          </p>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-4 text-sm text-gray-800 mb-6">
            {[
              "I acknowledge that I am a clinical user authorized to access the SADQ tool.",
              "I understand that usage may be monitored for operational tracking and improvement purposes.",
              "I agree not to share access credentials or use the tool for unauthorized purposes.",
            ].map((text, idx) => (
              <label key={idx} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreed[idx]}
                  onChange={() => handleCheckboxChange(idx)}
                  className="mt-1"
                />
                <span>{text}</span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="mb-4">
            <button
              onClick={handleLogin}
              disabled={!agreed.every(Boolean)}
              className={`w-full font-semibold py-2 rounded transition ${
                agreed.every(Boolean)
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Log In
            </button>
          </div>

          <p className="text-xs text-center mt-2 text-gray-500">
            Don't have an account? {" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
            >
              Register
            </span>
          </p>

          <p className="text-xs text-center mt-4 text-gray-500">
            Questions? Contact {" "}
            <a
              href="mailto:support@genkimd.com"
              className="text-blue-600 underline"
            >
              support@genkimd.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
