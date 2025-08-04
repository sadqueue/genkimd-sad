import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { app } from "./firebaseConfig";
// import { serverTimestamp, setDoc, doc } from "firebase/firestore";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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
    // role: "Doctor",
    // department: "",
    // npi: ""
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
      setError("⚠️ Passwords do not match.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
  
      const displayName =
        form.firstName?.trim() && form.lastName?.trim()
          ? `${form.firstName.trim()} ${form.lastName.trim()}`
          : form.firstName?.trim() || "User";
  
      // ✅ Set Firebase display name
      await updateProfile(user, { displayName });
  
      // ✅ Add user doc to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        email: form.email,
        role: form.role || "viewer",
        // department: form.department || "",
        // npi: form.npi || "",
        createdAt: serverTimestamp(),
        displayName,
      });
  
      navigate("/login", { state: { email: form.email, success: true } });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("⚠️ An account with this email already exists. Please log in instead.");
      } else {
        setError(`❌ Registration failed. ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

        {["firstName", "lastName", "email", "password", "confirmPassword"].map((field, idx) => (
          <div className="mb-4" key={idx}>
            <input
              type={field.toLowerCase().includes("password") ? "password" : "text"}
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

        {/* <div className="mb-4">
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
        </div> */}

<label className="flex items-start space-x-2">
  <input
    type="checkbox"
    checked={agreed}
    onChange={() => setAgreed(!agreed)}
    className="mt-1"
  />
  <span className="text-sm text-gray-700">
    I acknowledge that I am a clinical user authorized to access the SADQ tool.
    I understand that usage may be monitored for operational tracking and improvement purposes.
    I agree not to share access credentials or use the tool for unauthorized purposes.
  </span>
</label><br></br>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
        onClick={handleRegister}
  disabled={!agreed}
  className={`mt-4 w-full py-2 rounded text-white font-semibold ${
    agreed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
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
