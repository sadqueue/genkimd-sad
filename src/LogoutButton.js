import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Logout() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute right-4 top-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default Logout;
