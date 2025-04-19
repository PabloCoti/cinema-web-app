import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";

import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ListUsers from "./pages/User/ListUsers";
import NotFound from "./pages/Responses/NotFound";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/responses">
            <Route path="not-found" element={<NotFound />} />
          </Route>

          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/users" element={<ListUsers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
