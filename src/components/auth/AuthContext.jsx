
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { customBase } from "../firebase/customBase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe;
    let requestId = 0;

    const initializeAuth = async () => {
      try {
        // Restore saved login session
        await customBase.autoInit();

        if (!active) return;

        // Listen for login/logout changes
        unsubscribe = customBase.auth.onChange(async (currentUser) => {
          if (!active) return;

          const currentRequest = ++requestId;

          // Wait until user information is loaded
          setLoading(true);

          if (!currentUser) {
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }

          try {
            const userData = await customBase.db.get(
              `USER/${currentUser.uid}`
            );

            if (!active || currentRequest !== requestId) return;

            setUser(currentUser);
            setRole(userData?.RL || userData?.role || null);

          } catch (error) {
            console.error("User data loading error:", error);

            if (!active || currentRequest !== requestId) return;

            setUser(currentUser);
            setRole(null);

          } finally {
            if (active && currentRequest === requestId) {
              setLoading(false);
            }
          }
        });

      } catch (error) {
        console.error("Authentication initialization error:", error);

        if (active) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
      requestId++;

      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    await customBase.auth.signOut();
  };

  const value = {
    user,
    role,
    loading,
    isLoggedIn: !!user,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
