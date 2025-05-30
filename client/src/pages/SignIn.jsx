import { useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import AppTheme from "../shared-theme/AppTheme";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../utils/validation";
import ErrorMessageBox from "../components/ErrorMessageBox";
import ColorModeSelect from "../shared-theme/ColorModeSelect";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [credentialsError, setCredentialsError] = useState(false);

  const validateInputs = () => {
    const email = document.getElementById("email").value;
    const emailValidation = validateEmail(email);
    setEmailError(!emailValidation.isValid);
    setEmailErrorMessage(emailValidation.message);

    const password = document.getElementById("password").value;
    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Por favor, ingresa tu contraseña");
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
  };

  const auth = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (emailError || passwordError) return;

    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData.entries());

    try {
      await auth.signInAction(formData);
    } catch (error) {
      setCredentialsError(true);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Iniciar sesión
          </Typography>
          {credentialsError && (
            <ErrorMessageBox>
              <Typography>
                Las credenciales ingresadas son incorrectas. Por favor, verifica
                tu correo y contraseña.
              </Typography>
            </ErrorMessageBox>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Correo</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="Ingresa tu correo"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              {<FormLabel htmlFor="password">Contraseña</FormLabel>}
              <TextField
                name="password"
                placeholder="Ingresa tu contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox value="remember" color="primary" name="remember" />
              }
              label="Recuérdame"
            />
            {/* TODO forgotten password management */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Iniciar sesión
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              ¿Aún no tienes cuenta?{" "}
              <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
                Crear cuenta
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
