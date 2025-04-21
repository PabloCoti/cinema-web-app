import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import Layout from "../../components/Layout";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import TableWithPagination from "../../components/TableWithPagination";
import { listRooms, updateRoom, deleteRoom } from "../../api/roomService";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function ListRooms() {
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await listRooms();
      setRooms(response.data);
    };

    fetchRooms();
  }, []);

  const [anchorElActions, setAnchorElActions] = useState({
    anchorEl: null,
    roomId: null,
  });

  const [openDeactivateModal, setOpenDeactivateModal] = useState(
    rooms.reduce((acc, room) => {
      acc[`deactivate-${room.id}`] = false;
      return acc;
    }, {})
  );

  const [openActivateModal, setOpenActivateModal] = useState(
    rooms.reduce((acc, room) => {
      acc[`activate-${room.id}`] = false;
      return acc;
    }, {})
  );

  const [openDeleteModal, setOpenDeleteModal] = useState(
    rooms.reduce((acc, room) => {
      acc[`delete-${room.id}`] = false;
      return acc;
    }, {})
  );

  const open = Boolean(anchorElActions.anchorEl);

  const handleOpenMenuActions = (event, roomId) => {
    setAnchorElActions({ anchorEl: event.currentTarget, roomId });
  };

  const handleMenuItemActions = (action, roomId) => {
    setAnchorElActions({ anchorEl: null, roomId: null });

    switch (action) {
      case "edit":
        navigate(`/rooms/edit/${roomId}`);
        break;

      case "deactivate":
        setOpenDeactivateModal((prev) => ({
          ...prev,
          [`deactivate-${roomId}`]: true,
        }));
        break;

      case "activate":
        setOpenActivateModal((prev) => ({
          ...prev,
          [`activate-${roomId}`]: true,
        }));
        break;

      case "delete":
        setOpenDeleteModal((prev) => ({
          ...prev,
          [`delete-${roomId}`]: true,
        }));
        break;

      default:
        break;
    }
  };

  const handleCloseModal = async (modalType, roomId, args = null) => {
    switch (modalType) {
      case "deactivate":
        setOpenDeactivateModal((prev) => ({
          ...prev,
          [`deactivate-${roomId}`]: false,
        }));

        if (args["action"] === "confirm") {
          try {
            const response = await updateRoom(roomId, { isActive: false });

            if (response.status === 200) {
              setRooms((prevRooms) =>
                prevRooms.map((room) =>
                  room.id === roomId ? { ...room, isActive: false } : room
                )
              );
              showSnackbar("Sala deshabilitada correctamente", "success");
            }
          } catch (error) {
            showSnackbar(
              "Error al deshabilitar la sala, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        }
        break;

      case "activate":
        setOpenActivateModal((prev) => ({
          ...prev,
          [`activate-${roomId}`]: false,
        }));

        if (args["action"] === "confirm") {
          try {
            const response = await updateRoom(roomId, { isActive: true });

            if (response.status === 200) {
              setRooms((prevRooms) =>
                prevRooms.map((room) =>
                  room.id === roomId ? { ...room, isActive: true } : room
                )
              );
              showSnackbar("Sala habilitada correctamente", "success");
            }
          } catch (error) {
            showSnackbar(
              "Error al habilitar la sala, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        }
        break;

      case "delete":
        setOpenDeleteModal((prev) => ({
          ...prev,
          [`delete-${roomId}`]: false,
        }));

        if (args["action"] === "confirm") {
          try {
            const response = await deleteRoom(roomId);
            if (response.status === 204) {
              setRooms((prevRooms) =>
                prevRooms.filter((room) => room.id !== roomId)
              );
              showSnackbar("Sala eliminada correctamente", "success");
            }
          } catch (error) {
            showSnackbar(
              "Error al eliminar la sala, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        }
        break;

      default:
        break;
    }
  };

  const headers = ["Estado", "Código", "Capacidad", ""];

  const renderRow = (room) => (
    <TableRow key={room.id}>
      <TableCell>
        <Box display="flex" alignItems="center" justifyContent="center">
          {room.isActive ? (
            <Badge color="success" badgeContent="Activo" />
          ) : (
            <Badge color="error" badgeContent="Inactivo" />
          )}
        </Box>
      </TableCell>
      <TableCell>{room.code}</TableCell>
      <TableCell>{room.capacity}</TableCell>
      <TableCell align="right">
        <IconButton
          id={`actions-button-${room.id}`}
          size="small"
          aria-controls={open ? `actions-menu-${room.id}` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(event) => handleOpenMenuActions(event, room.id)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`actions-menu-${room.id}`}
          anchorEl={anchorElActions.anchorEl}
          open={open && anchorElActions.roomId === room.id}
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
          {room.isActive ? (
            [
              <MenuItem
                key={`edit-${room.id}`}
                onClick={() => handleMenuItemActions("edit", room.id)}
              >
                <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
                Editar
              </MenuItem>,
              <MenuItem
                sx={{ color: "warning.main" }}
                key={`deactivate-${room.id}`}
                onClick={() => handleMenuItemActions("deactivate", room.id)}
              >
                <RemoveCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                Deshabilitar
              </MenuItem>,
            ]
          ) : (
            <MenuItem
              sx={{ color: "success.main" }}
              onClick={() => handleMenuItemActions("activate", room.id)}
            >
              <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
              Habilitar
            </MenuItem>
          )}
          <MenuItem
            sx={{ color: "error.main" }}
            key={`delete-${room.id}`}
            onClick={() => handleMenuItemActions("delete", room.id)}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
            Eliminar
          </MenuItem>
        </Menu>
        <ConfirmationModal
          key={`deactivate-${room.id}`}
          open={openDeactivateModal[`deactivate-${room.id}`]}
          onClose={() =>
            handleCloseModal("deactivate", room.id, { action: "cancel" })
          }
          onConfirm={() =>
            handleCloseModal("deactivate", room.id, { action: "confirm" })
          }
          title="¿Estás seguro de hacer esto?"
          description="Esta acción deshabilitará la sala y no podrá ser utilizada por los usuarios."
        />
        <ConfirmationModal
          key={`activate-${room.id}`}
          open={openActivateModal[`activate-${room.id}`]}
          onClose={() =>
            handleCloseModal("activate", room.id, { action: "cancel" })
          }
          onConfirm={() =>
            handleCloseModal("activate", room.id, { action: "confirm" })
          }
          title="¿Estás seguro de hacer esto?"
          description="Esta acción habilitará la sala y podrá ser utilizada por los usuarios."
        />
        <ConfirmationModal
          key={`delete-${room.id}`}
          open={openDeleteModal[`delete-${room.id}`]}
          onClose={() =>
            handleCloseModal("delete", room.id, { action: "cancel" })
          }
          onConfirm={() =>
            handleCloseModal("delete", room.id, { action: "confirm" })
          }
          title="¿Estás seguro de hacer esto?"
          description="Esta acción no se puede deshacer. Si eliminas esta sala, no podrás recuperarla."
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Layout>
      <Breadcrumbs>
        <Typography>Salas</Typography>
        <Typography>Lista de salas</Typography>
      </Breadcrumbs>
      <Box display="flex" justifyContent="right" mb={2}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/rooms/create")}
          >
            Crear sala
          </Button>
        </Box>
      </Box>
      <TableWithPagination
        headers={headers}
        rows={rooms}
        renderRow={renderRow}
      />
    </Layout>
  );
}
