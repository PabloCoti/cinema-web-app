import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { validateSession } from "../api/userService";

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await validateSession();
        setIsValid(response.data.valid);
      } catch {
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) return <div>Loading...</div>; // TODO: Make a proper loading view
  if (!isValid) return <Navigate to="/signin" />;

  return <Outlet />;
};

export default PrivateRoute;
