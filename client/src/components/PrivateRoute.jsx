import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { validateSession } from "../api/userService";

const PrivateRoute = ({ requiredRole }) => {
  const [isValid, setIsValid] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await validateSession();
        setIsValid(response.data.valid);
        setUserRole(response.data.user.role);
      } catch {
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) return <div>Loading...</div>; // TODO: Make a proper loading view

  if (!isValid || (requiredRole === "user" && userRole !== requiredRole))
    return <Navigate to="/signin" />;

  if (!isValid || (requiredRole && userRole !== requiredRole))
    return <Navigate to="/responses/not-found" />;

  return <Outlet />;
};

export default PrivateRoute;
