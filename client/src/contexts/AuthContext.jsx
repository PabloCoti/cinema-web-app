import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router";
import { logOut, signIn } from "../api/userService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
