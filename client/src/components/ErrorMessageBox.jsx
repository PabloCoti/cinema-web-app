import React from "react";
import Box from "@mui/material/Box";

export default function ErrorMessageBox({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
        border: "1px solid",
        borderColor: "error.main",
        borderRadius: 1,
        backgroundColor: "error.light",
        color: "error.contrastText",
      }}
    >
      {children}
    </Box>
  );
}
