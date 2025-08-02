import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { app } from "./firebaseConfig";

const auth = getAuth(app);
const firestore = getFirestore(app);

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Doctor",
    department: "",
    npi: ""
  });
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState([false, false, false]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (index) => {
    const updated = [...agreed];
    updated[index] = !updated[index];
    setAgreed(updated);
  };

  const handleRegister = async () => {
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });

      await setDoc(doc(firestore, "users", user.uid), {
        email: form.email,
        role: form.role,
        department: form.department,
        npi: form.npi,
        createdAt: new Date(),
      });

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          user_name: `${form.firstName} ${form.lastName}`,
          user_email: form.email,
          message: "A new user has registered.",
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      navigate("/login", { state: { email: form.email, success: true } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        {["firstName", "lastName", "email", "password", "confirmPassword", "department", "npi"].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              value={form[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="mb-4">
          <select
            name="role"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
            value={form.role}
            onChange={handleChange}
          >
            <option>Doctor</option>
            <option>Admin</option>
            <option>Nurse</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-4 text-sm text-gray-800 mb-6">
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
              <span>{text}</span>
            </label>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleRegister}
          disabled={!agreed.every(Boolean)}
          className={`w-full font-semibold py-2 rounded transition ${
            agreed.every(Boolean)
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Register
        </button>

        <p className="text-xs text-center mt-2 text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
