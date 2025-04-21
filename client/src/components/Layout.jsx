import { useContext } from "react";
import { Outlet } from "react-router";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

import NavBar from "./NavBar";
import AppTheme from "../shared-theme/AppTheme";
import { SnackbarContext } from "../contexts/SnackbarContext";

export default function Layout(props) {
  const { snackbarOpen, snackbarMessage, snackbarSeverity, closeSnackbar } =
    useContext(SnackbarContext);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <NavBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        <Outlet />
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
