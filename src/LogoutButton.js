import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Logout() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    if (!navigator.onLine) {
      console.log("Offline mode: skipping Firebase call.");
      return;
    }
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
  className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded shadow hover:bg-red-600 transition z-10"
>
  Logout
</button>
  );
}

export default Logout;
