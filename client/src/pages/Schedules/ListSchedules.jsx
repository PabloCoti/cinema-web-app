import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../../utils/dateTime";
import {
  listSchedules,
  updateSchedule,
  deleteSchedule,
} from "../../api/scheduleService";
import TableWithPagination from "../../components/TableWithPagination";
import ConfirmationModal from "../../components/ConfirmationModal";
import { SnackbarContext } from "../../contexts/SnackbarContext";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export default function ListSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [anchorElActions, setAnchorElActions] = useState({
    anchorEl: null,
    scheduleId: null,
  });
  const [openDeactivateModal, setOpenDeactivateModal] = useState({});
  const [openActivateModal, setOpenActivateModal] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState({});

  const { showSnackbar } = useContext(SnackbarContext);

  const open = Boolean(anchorElActions.anchorEl);
  const headers = [
    "Sala",
    "Película",
    "Fecha",
    "Inicia",
    "Termina",
    "Precio",
    "",
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await listSchedules();
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  const handleOpenMenuActions = (event, scheduleId) => {
    setAnchorElActions({
      anchorEl: event.currentTarget,
      scheduleId: scheduleId,
    });
  };

  const handleMenuItemActions = (action, scheduleId) => {
    setAnchorElActions({ anchorEl: null, scheduleId: null });

    switch (action) {
      case "edit":
        navigate(`/schedules/edit/${scheduleId}`);
        break;
      case "deactivate":
        setOpenDeactivateModal((prev) => ({ ...prev, [scheduleId]: true }));
        break;
      case "activate":
        setOpenActivateModal((prev) => ({ ...prev, [scheduleId]: true }));
        break;
      case "delete":
        setOpenDeleteModal((prev) => ({ ...prev, [scheduleId]: true }));
        break;
      default:
        break;
    }
  };

  const handleCloseModal = async (type, scheduleId, confirm = false) => {
    if (type === "deactivate") {
      setOpenDeactivateModal((prev) => ({ ...prev, [scheduleId]: false }));
      if (confirm) {
        try {
          await updateSchedule(scheduleId, { isActive: false });
          setSchedules((prev) =>
            prev.map((s) =>
              s.id === scheduleId ? { ...s, isActive: false } : s
            )
          );
          showSnackbar("Función desactivada correctamente", "success");
        } catch {
          showSnackbar("Error al desactivar la función", "error");
        }
      }
    }
    if (type === "activate") {
      setOpenActivateModal((prev) => ({ ...prev, [scheduleId]: false }));
      if (confirm) {
        try {
          await updateSchedule(scheduleId, { isActive: true });
          setSchedules((prev) =>
            prev.map((s) =>
              s.id === scheduleId ? { ...s, isActive: true } : s
            )
          );
          showSnackbar("Función activada correctamente", "success");
        } catch {
          showSnackbar("Error al activar la función", "error");
        }
      }
    }
    if (type === "delete") {
      setOpenDeleteModal((prev) => ({ ...prev, [scheduleId]: false }));
      if (confirm) {
        try {
          await deleteSchedule(scheduleId);
          setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
          showSnackbar("Función eliminada correctamente", "success");
        } catch {
          showSnackbar("Error al eliminar la función", "error");
        }
      }
    }
  };

  const renderRow = (schedule) => (
    <TableRow key={schedule.id}>
      <TableCell>
        <Box display="flex" alignItems="center" justifyContent="center">
          {schedule.isActive ? (
            <Badge color="success" badgeContent="Activa" />
          ) : (
            <Badge color="error" badgeContent="Inactiva" />
          )}
        </Box>
      </TableCell>
      <TableCell>{schedule.Room.code}</TableCell>
      <TableCell>{schedule.Movie.title}</TableCell>
      <TableCell>{formatDate(schedule.date)}</TableCell>
      <TableCell>{schedule.startTime}</TableCell>
      <TableCell>{schedule.endTime}</TableCell>
      <TableCell>{schedule.price}</TableCell>
      <TableCell align="right">
        <IconButton
          id={`actions-button-${schedule.id}`}
          size="small"
          aria-controls={open ? `actions-menu-${schedule.id}` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(event) => handleOpenMenuActions(event, schedule.id)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`actions-menu-${schedule.id}`}
          anchorEl={anchorElActions.anchorEl}
          open={open && anchorElActions.scheduleId === schedule.id}
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
            key={`edit-${schedule.id}`}
            onClick={() => handleMenuItemActions("edit", schedule.id)}
          >
            <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
            Editar
          </MenuItem>
          {schedule.isActive ? (
            <MenuItem
              sx={{ color: "warning.main" }}
              key={`deactivate-${schedule.id}`}
              onClick={() => handleMenuItemActions("deactivate", schedule.id)}
            >
              <RemoveCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
              Desactivar
            </MenuItem>
          ) : (
            <MenuItem
              sx={{ color: "success.main" }}
              key={`activate-${schedule.id}`}
              onClick={() => handleMenuItemActions("activate", schedule.id)}
            >
              <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
              Activar
            </MenuItem>
          )}
          <MenuItem
            sx={{ color: "error.main" }}
            key={`delete-${schedule.id}`}
            onClick={() => handleMenuItemActions("delete", schedule.id)}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
            Eliminar
          </MenuItem>
        </Menu>
        <ConfirmationModal
          open={!!openDeactivateModal[schedule.id]}
          onClose={() => handleCloseModal("deactivate", schedule.id, false)}
          onConfirm={() => handleCloseModal("deactivate", schedule.id, true)}
          title="¿Desactivar función?"
          description="Esta acción desactivará la función y no podrá ser reservada."
        />
        <ConfirmationModal
          open={!!openActivateModal[schedule.id]}
          onClose={() => handleCloseModal("activate", schedule.id, false)}
          onConfirm={() => handleCloseModal("activate", schedule.id, true)}
          title="¿Activar función?"
          description="Esta acción activará la función y podrá ser reservada."
        />
        <ConfirmationModal
          open={!!openDeleteModal[schedule.id]}
          onClose={() => handleCloseModal("delete", schedule.id, false)}
          onConfirm={() => handleCloseModal("delete", schedule.id, true)}
          title="¿Eliminar función?"
          description="Esta acción eliminará la función y no podrá ser recuperada."
        />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Breadcrumbs>
        <Typography>Funciones</Typography>
        <Typography>Lista de funciones</Typography>
      </Breadcrumbs>
      <Box display="flex" justifyContent="right" mb={2}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/schedules/create")}
          >
            Crear función
          </Button>
        </Box>
      </Box>
      <TableWithPagination
        headers={headers}
        rows={schedules}
        renderRow={renderRow}
      />
    </>
  );
}
