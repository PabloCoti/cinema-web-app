import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import EditRoom from "./pages/Rooms/EditRoom";
import ListUsers from "./pages/User/ListUsers";
import ListRooms from "./pages/Rooms/ListRooms";
import AuthProvider from "./contexts/AuthContext";
import NotFound from "./pages/Responses/NotFound";
import CreateRoom from "./pages/Rooms/CreateRoom";
import PrivateRoute from "./components/PrivateRoute";
import { SnackbarProvider } from "./contexts/SnackbarContext";

export default function App() {
  return (
    <SnackbarProvider>
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

              <Route path="/rooms">
                <Route path="edit/:roomId" element={<EditRoom />} />
                <Route path="list" element={<ListRooms />} />
                <Route path="create" element={<CreateRoom />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </SnackbarProvider>
  );
}
