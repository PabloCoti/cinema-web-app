import * as React from "react";

import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { alpha, styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function NavBar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const open = Boolean(anchorElUser);
  const handleClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => navigate("/")}
              >
                Inicio
              </Button>
              {user?.role === "admin" && (
                <>
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => navigate("/schedules/list")}
                  >
                    Funciones
                  </Button>
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => navigate("/rooms/list")}
                  >
                    Salas
                  </Button>
                  <Button
                    variant="text"
                    color="info"
                    size="small"
                    onClick={() => navigate("/users")}
                  >
                    Usuarios
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {user ? (
              <>
                <IconButton
                  id="user-button"
                  size="small"
                  aria-controls={open ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <PersonIcon />
                </IconButton>
                <Menu
                  id="user-menu"
                  anchorEl={anchorElUser}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "user-button",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/reservations");
                    }}
                  >
                    Reservas
                  </MenuItem>
                  <MenuItem onClick={signOut}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={() => navigate("/signin")}
                >
                  Iniciar sesión
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/signup")}
                >
                  Crear cuenta
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={openDrawer}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => navigate("/")}>Inicio</MenuItem>
                {user?.role === "admin" && (
                  <>
                    <MenuItem onClick={() => navigate("/schedules/list")}>
                      Funciones
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/rooms/list")}>
                      Salas
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/users")}>
                      Usuarios
                    </MenuItem>
                  </>
                )}
                <Divider sx={{ my: 3 }} />
                {user ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        navigate("/reservations");
                      }}
                    >
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={signOut}
                      >
                        Reservas
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={signOut}
                      >
                        Cerrar sesión
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={() => navigate("/signup")}
                      >
                        Crear cuenta
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate("/signin")}
                      >
                        Iniciar sesión
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
