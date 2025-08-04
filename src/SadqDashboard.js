import React, { useEffect, useState } from "react";
import HomePage from "./HomePage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig";

function SadqDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 sm:p-6">
        <HomePage canEdit={!!user} />
      </main>
    </div>
  );
}

export default SadqDashboard;
