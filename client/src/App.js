import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import EditRoom from "./pages/Rooms/EditRoom";
import ListUsers from "./pages/User/ListUsers";
import ListRooms from "./pages/Rooms/ListRooms";
import EditMovie from "./pages/Movies/EditMovie";
import AuthProvider from "./contexts/AuthContext";
import NotFound from "./pages/Responses/NotFound";
import CreateRoom from "./pages/Rooms/CreateRoom";
import PrivateRoute from "./components/PrivateRoute";
import CreateMovie from "./pages/Movies/CreateMovie";
import EditSchedule from "./pages/Schedules/EditSchedule";
import ListSchedules from "./pages/Schedules/ListSchedules";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import CreateSchedule from "./pages/Schedules/CreateSchedule";

export default function App() {
  return (
    <SnackbarProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/" element={<Layout />}>
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

                <Route path="/movies">
                  <Route path="create" element={<CreateMovie />} />
                  <Route path="edit/:movieId" element={<EditMovie />} />
                </Route>

                <Route path="/schedules">
                  <Route path="list" element={<ListSchedules />} />
                  <Route path="create" element={<CreateSchedule />} />
                  <Route path="edit/:scheduleId" element={<EditSchedule />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </SnackbarProvider>
  );
}
