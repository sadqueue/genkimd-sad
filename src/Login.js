import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app, db } from "./firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState([false, false, false]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleCheckboxChange = (index) => {
    const updated = [...agreed];
    updated[index] = !updated[index];
    setAgreed(updated);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

      // Update Firestore: set lastLogin timestamp
      await updateDoc(doc(db, "users", uid), {
        lastLogin: serverTimestamp(),
      });

      navigate("/sadq");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 sm:p-4 sm:p-6">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
            Welcome to SADQ – Secure Access Portal
          </h2>
          <p className="text-sm text-center text-gray-600 mb-4 sm:mb-6">
            Secure login to protect data and ensure smooth clinical operations.
          </p>

          {location.state?.success && (
            <div className="mb-4 text-green-600 text-sm text-center">
              Account created successfully! Please log in.
            </div>
          )}

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

          {/* Optional: Uncomment if you implement forgot password
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 underline cursor-pointer mt-2 text-center"
          >
            Forgot Password?
          </p>
          */}

{/* <div className="space-y-4 text-sm text-gray-800 mb-6">
  {[
    "I acknowledge that I am a clinical user authorized to access the SADQ tool.",
    "I understand that usage may be monitored for operational tracking and improvement purposes.",
    "I agree not to share access credentials or use the tool for unauthorized purposes.",
  ].map((text, idx) => (
    <label key={idx} className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={agreed[idx]}
        onChange={() => handleCheckboxChange(idx)}
        className="mt-1"
      />
      <span className="break-words">{text}</span>
    </label>
  ))}
</div> */}



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
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
            >
              Register
            </span>
          </p>

          <p className="text-xs text-center mt-4 text-gray-500">
            Questions? Contact{" "}
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
