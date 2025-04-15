import * as React from "react";

import NavBar from "./NavBar";
import Container from "@mui/material/Container";
import AppTheme from "../shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

export default function AppAppBar({ children }, props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <NavBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        {children}
      </Container>
    </AppTheme>
  );
}
