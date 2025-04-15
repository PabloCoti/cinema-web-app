import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logOut, signIn, validateSession } from "../api/userService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await validateSession();
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signInAction = async (data) => {
    try {
      const response = await signIn(data);
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logOut();
      setUser(null);
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) return <div>Loading...</div>; // Show loading state

  return (
    <AuthContext.Provider value={{ user, signInAction, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
