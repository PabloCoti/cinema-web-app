import React, { createContext, useState } from "react";

export const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider
      value={{ snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, closeSnackbar }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}
