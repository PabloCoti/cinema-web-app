import { createContext, useContext, useEffect, useState } from "react";

import apiClient from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get("/auth/session", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
