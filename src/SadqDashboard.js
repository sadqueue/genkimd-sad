import React, { useEffect, useState } from "react";
import HomePage from "./HomePage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

function SadqDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(); // or import your existing `auth` instance
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <HomePage canEdit={!!user} />
      </main>
    </div>
  );
}

export default SadqDashboard;
