import * as React from "react";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";

import { signUp } from "../api/userService";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { validateEmail, validatePassword } from "../utils/validation";
import ErrorMessageBox from "../components/ErrorMessageBox";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
  },
}));

export default function SignUp(props) {
  const navigate = useNavigate();

  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");

  const [existingUserError, setExistingUserError] = React.useState(false);

  const validateInputs = () => {
    const email = document.getElementById("email").value;
    const emailValidation = validateEmail(email);
    setEmailError(!emailValidation.isValid);
    setEmailErrorMessage(emailValidation.message);

    const password = document.getElementById("password").value;
    const passwordValidation = validatePassword(password);
    setPasswordError(!passwordValidation.isValid);
    setPasswordErrorMessage(passwordValidation.message);

    const name = document.getElementById("name").value;
    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage("Por favor, ingresa tu(s) nombre(s)");
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    const lastName = document.getElementById("lastName").value;
    if (!lastName || lastName.length < 1) {
      setLastNameError(true);
      setLastNameErrorMessage("Por favor, ingresa tu(s) apellido(s)");
    } else {
      setLastNameError(false);
      setLastNameErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (lastNameError || nameError || emailError || passwordError) return;

    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData.entries());

    try {
      const response = await signUp(formData);

      if (response.status === 201) {
        navigate("/signin");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setExistingUserError(true);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {existingUserError && (
            <ErrorMessageBox>
              <Typography>
                Correo en uso, si ya tienes una cuenta,{" "}
                <Link
                  href="/signin"
                  sx={{ color: "inherit", textDecoration: "underline" }}
                >
                  inicia sesión
                </Link>
              </Typography>
            </ErrorMessageBox>
          )}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Crear cuenta
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="firstName">Nombres</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Ingresa tu(s) nombre(s)"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastName">Appellidos</FormLabel>
              <TextField
                autoComplete="lastName"
                name="lastName"
                required
                fullWidth
                id="lastName"
                placeholder="Ingresa tu(s) apellido(s)"
                error={lastNameError}
                helperText={lastNameErrorMessage}
                color={lastNameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Correo</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="Introduce tu correo"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="Introduce tu contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Crear cuenta
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
                Inicia sesión
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
