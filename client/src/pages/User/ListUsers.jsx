import { useState, useEffect } from "react";

import Layout from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { listUsers, updateUser } from "../../api/userService";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import Badge from "@mui/material/Badge";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from "@mui/material/Snackbar";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TableFooter from "@mui/material/TableFooter";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, useTheme } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

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
  const theme = useTheme();
  const auth = useAuth();

  const [users, setUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRoles, setSelectedRoles] = useState({});

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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              setSnackbarMessage("Usuario actualizado con éxito");
              setSnackbarOpen(true);
            }
          } catch (error) {
            setSnackbarMessage(
              "Error al actualizar el usuario, por favor, contacta con soporte o intenta de nuevo."
            );
            setSnackbarOpen(true);
          }
        } else {
          setSelectedRoles((prev) => ({
            ...prev,
            [userId]: args["userRole"],
          }));
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
              setUsers((prevUsers) => {
                return prevUsers.map((user) =>
                  user.id === userId ? { ...user, isActive: false } : user
                );
              });

              setSnackbarMessage("Usuario desactivado con éxito");
              setSnackbarOpen(true);
            }
          } catch (e) {
            setSnackbarMessage(
              "Error al desactivar el usuario, por favor, contacta con soporte o intenta de nuevo."
            );
            setSnackbarOpen(true);
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

  return (
    <Layout>
      <Breadcrumbs>
        <Typography>Usuarios</Typography>
        <Typography>Lista de usuarios</Typography>
      </Breadcrumbs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? users.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : users
            ).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
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
                        aria-controls={
                          open ? `actions-menu-${user.id}` : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(event) =>
                          handleOpenMenuActions(event, user.id)
                        }
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
                        <MenuItem
                          onClick={() => handleMenuItemActions("changeRole")}
                        >
                          Cambiar Rol
                        </MenuItem>
                        {user.isActive && (
                          <MenuItem
                            onClick={() => handleMenuItemActions("deactivate")}
                          >
                            Desactivar
                          </MenuItem>
                        )}
                      </Menu>

                      <Modal
                        id={`user-roles-change-${user.id}`}
                        aria-labelledby="role-change-modal-title"
                        aria-describedby="role-change-modal-description"
                        open={
                          openUpdateRoleModal[`user-roles-change-${user.id}`]
                        }
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          },
                        }}
                        disableEscapeKeyDown
                      >
                        <Fade
                          in={
                            openUpdateRoleModal[`user-roles-change-${user.id}`]
                          }
                        >
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
                                  handleCloseModal(
                                    "user-roles-change",
                                    user.id,
                                    {
                                      action: "cancel",
                                      userRole: user.role,
                                    }
                                  )
                                }
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handleCloseModal(
                                    "user-roles-change",
                                    user.id,
                                    {
                                      action: "save",
                                    }
                                  )
                                }
                              >
                                Guardar
                              </Button>
                            </div>
                          </Card>
                        </Fade>
                      </Modal>
                      <Modal
                        id={`user-deactivate-${user.id}`}
                        aria-labelledby="deactivate-user-modal-title"
                        aria-describedby="deactivate-user-modal-description"
                        open={openDeactivateModal[`user-deactivate-${user.id}`]}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          },
                        }}
                        disableEscapeKeyDown
                      >
                        <Fade
                          in={openDeactivateModal[`user-deactivate-${user.id}`]}
                        >
                          <Card>
                            <Typography
                              variant="h6"
                              gutterBottom
                              align="center"
                            >
                              ¿Estás seguro de hacer esto?
                            </Typography>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "1rem",
                              }}
                            >
                              <Button
                                variant="outlined"
                                style={{ width: "50%" }}
                                onClick={() =>
                                  handleCloseModal("user-deactivate", user.id, {
                                    action: "cancel",
                                  })
                                }
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="contained"
                                style={{ width: "50%" }}
                                onClick={() =>
                                  handleCloseModal("user-deactivate", user.id, {
                                    action: "confirm",
                                  })
                                }
                              >
                                Confirmar
                              </Button>
                            </div>
                          </Card>
                        </Fade>
                      </Modal>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={page}
                count={users.length}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Por página"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
