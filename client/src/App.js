import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";

import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<PrivateRoute />}>
            {/* Dashboard is a public route, but will remain as private for demonstrative purposes */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
