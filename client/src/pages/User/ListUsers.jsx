import { useState, useEffect, useContext } from "react";

import Layout from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { listUsers, updateUser } from "../../api/userService";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import TableWithPagination from "../../components/TableWithPagination";
import ConfirmationModal from "../../components/ConfirmationModal";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Backdrop from "@mui/material/Backdrop";
import EditIcon from "@mui/icons-material/Edit";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const Card = styled(MuiCard)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  p: 4,
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

export default function ListUsers() {
  const auth = useAuth();
  const theme = useTheme();

  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await listUsers();
      setUsers(response.data);

      setSelectedRoles(
        response.data.reduce((acc, user) => {
          acc[user.id] = user.role || "";
          return acc;
        }, {})
      );
    };

    fetchUsers();
  }, []);

  const [anchorElActions, setAnchorElActions] = useState({
    anchorEl: null,
    userId: null,
  });
  const open = Boolean(anchorElActions.anchorEl);

  const [openUpdateRoleModal, setOpenUpdateRoleModal] = useState(
    users.reduce((acc, user) => {
      acc[`user-roles-change-${user.id}`] = false;
      return acc;
    }, {})
  );

  const [openDeactivateModal, setOpenDeactivateModal] = useState(
    users.reduce((acc, user) => {
      acc[`user-deactivate-${user.id}`] = false;
      return acc;
    }, {})
  );

  const [openActivateModal, setOpenActivateModal] = useState(
    users.reduce((acc, user) => {
      acc[`user-activate-${user.id}`] = false;
      return acc;
    }, {})
  );

  const handleRoleChange = (userId, newRole) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleOpenMenuActions = (event, userId) => {
    setAnchorElActions({ anchorEl: event.currentTarget, userId });
  };

  const handleMenuItemActions = (action) => {
    setAnchorElActions({ anchorEl: null, userId: null });

    switch (action) {
      case "changeRole":
        setOpenUpdateRoleModal((prev) => ({
          ...prev,
          [`user-roles-change-${anchorElActions.userId}`]: true,
        }));
        break;

      case "activate":
        setOpenActivateModal((prev) => ({
          ...prev,
          [`user-activate-${anchorElActions.userId}`]: true,
        }));
        break;

      case "deactivate":
        setOpenDeactivateModal((prev) => ({
          ...prev,
          [`user-deactivate-${anchorElActions.userId}`]: true,
        }));
        break;

      default:
        break;
    }
  };

  const handleCloseModal = async (modalType, userId, args = null) => {
    switch (modalType) {
      case "user-roles-change":
        setOpenUpdateRoleModal((prev) => ({
          ...prev,
          [`user-roles-change-${userId}`]: false,
        }));

        if (args["action"] === "save") {
          try {
            const response = await updateUser(userId, {
              role: selectedRoles[userId],
            });

            if (response.status === 200) {
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userId
                    ? { ...user, role: selectedRoles[userId] }
                    : user
                )
              );
              showSnackbar("Usuario actualizado con éxito", "success");
            }
          } catch (error) {
            showSnackbar(
              "Error al actualizar el usuario, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        } else {
          setSelectedRoles((prev) => ({
            ...prev,
            [userId]: args["userRole"],
          }));
        }
        break;

      case "user-activate":
        setOpenActivateModal((prev) => ({
          ...prev,
          [`user-activate-${userId}`]: false,
        }));

        if (args["action"] === "confirm") {
          try {
            const response = await updateUser(userId, {
              isActive: true,
            });

            if (response.status === 200) {
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userId ? { ...user, isActive: true } : user
                )
              );
              showSnackbar("Usuario activado con éxito", "success");
            }
          } catch (error) {
            showSnackbar(
              "Error al activar el usuario, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        }
        break;

      case "user-deactivate":
        setOpenDeactivateModal((prev) => ({
          ...prev,
          [`user-deactivate-${userId}`]: false,
        }));

        if (args["action"] === "confirm") {
          try {
            const response = await updateUser(userId, {
              isActive: false,
            });

            if (response.status === 200) {
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user.id === userId ? { ...user, isActive: false } : user
                )
              );
              showSnackbar("Usuario desactivado con éxito", "success");
            }
          } catch (e) {
            showSnackbar(
              "Error al desactivar el usuario, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        }
        break;

      default:
        break;
    }
  };

  // TODO: make the DB normalization for roles
  // Easy roles solution for now
  const roles = {
    admin: "Administrador",
    user: "Usuario",
  };

  const headers = ["Estado", "Nombre", "Correo", "Rol", ""];

  const renderRow = (user) => (
    <TableRow key={user.id}>
      <TableCell>
        <Box display="flex" alignItems="center" justifyContent="center">
          {user.isActive ? (
            <Badge color="success" badgeContent="Activo" />
          ) : (
            <Badge color="error" badgeContent="Inactivo" />
          )}
        </Box>
      </TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{roles[user.role]}</TableCell>
      <TableCell align="right">
        {auth.user.id !== user.id && (
          <>
            <IconButton
              id={`actions-button-${user.id}`}
              size="small"
              aria-controls={open ? `actions-menu-${user.id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(event) => handleOpenMenuActions(event, user.id)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id={`actions-menu-${user.id}`}
              anchorEl={anchorElActions.anchorEl}
              open={open && anchorElActions.userId === user.id}
              onClose={() => handleMenuItemActions()}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {user.isActive ? (
                [
                  <MenuItem
                    key={`change-role-${user.id}`}
                    onClick={() => handleMenuItemActions("changeRole")}
                  >
                    <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Cambiar Rol
                  </MenuItem>,
                  <MenuItem
                    sx={{ color: "warning.main" }}
                    key={`deactivate-${user.id}`}
                    onClick={() => handleMenuItemActions("deactivate")}
                  >
                    <RemoveCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Desactivar
                  </MenuItem>,
                ]
              ) : (
                <MenuItem
                  sx={{ color: "success.main" }}
                  key={`activate-${user.id}`}
                  onClick={() => handleMenuItemActions("activate")}
                >
                  <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Activar
                </MenuItem>
              )}
            </Menu>
            <Modal
              id={`user-roles-change-${user.id}`}
              aria-labelledby="role-change-modal-title"
              aria-describedby="role-change-modal-description"
              open={openUpdateRoleModal[`user-roles-change-${user.id}`]}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
              disableEscapeKeyDown
            >
              <Fade in={openUpdateRoleModal[`user-roles-change-${user.id}`]}>
                <Card>
                  <Select
                    value={selectedRoles[user.id] || ""}
                    onChange={(event) =>
                      handleRoleChange(user.id, event.target.value)
                    }
                  >
                    {Object.entries(roles).map(([key, value]) => (
                      <MenuItem key={`${user.id}-${key}`} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: theme.breakpoints.up("md")
                        ? "flex-end"
                        : "space-between",
                      flexWrap: theme.breakpoints.down("md")
                        ? "wrap"
                        : "nowrap",
                      gap: "1rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleCloseModal("user-roles-change", user.id, {
                          action: "cancel",
                          userRole: user.role,
                        })
                      }
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleCloseModal("user-roles-change", user.id, {
                          action: "save",
                        })
                      }
                    >
                      Guardar
                    </Button>
                  </div>
                </Card>
              </Fade>
            </Modal>
            <ConfirmationModal
              key={`user-deactivate-${user.id}`}
              open={openDeactivateModal[`user-deactivate-${user.id}`]}
              onClose={() =>
                handleCloseModal("user-deactivate", user.id, {
                  action: "cancel",
                })
              }
              onConfirm={() =>
                handleCloseModal("user-deactivate", user.id, {
                  action: "confirm",
                })
              }
              title="¿Estás seguro de hacer esto?"
              description="Esta acción desactivará al usuario y no podrá iniciar sesión."
            />
            <ConfirmationModal
              key={`user-activate-${user.id}`}
              open={openActivateModal[`user-activate-${user.id}`]}
              onClose={() =>
                handleCloseModal("user-activate", user.id, { action: "cancel" })
              }
              onConfirm={() =>
                handleCloseModal("user-activate", user.id, {
                  action: "confirm",
                })
              }
              title="¿Estás seguro de hacer esto?"
              description="Esta acción activará al usuario y podrá iniciar sesión."
            />
          </>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Layout>
      <Breadcrumbs>
        <Typography>Usuarios</Typography>
        <Typography>Lista de usuarios</Typography>
      </Breadcrumbs>

      <TableWithPagination
        headers={headers}
        rows={users}
        renderRow={renderRow}
      />
    </Layout>
  );
}
