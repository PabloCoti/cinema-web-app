import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../contexts/AuthContext";
import { listMovies, deleteMovie } from "../api/movieService";
import { SnackbarContext } from "../contexts/SnackbarContext";
import ConfirmationModal from "../components/ConfirmationModal";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import ImageList from "@mui/material/ImageList";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ImageListItem from "@mui/material/ImageListItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ImageListItemBar from "@mui/material/ImageListItemBar";

export default function Dashboard() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [movies, setMovies] = useState([]);
  const [anchorElActions, setAnchorElActions] = useState({
    anchorEl: null,
    movieId: null,
  });

  const { user } = useAuth();
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const open = Boolean(anchorElActions.anchorEl);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await listMovies();
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const [openDeleteModal, setOpenDeleteModal] = useState(
    movies.reduce((acc, room) => {
      acc[`delete-${room.id}`] = false;
      return acc;
    }, {})
  );

  const handleCloseModal = async (modalType, movieId, args = null) => {
    switch (modalType) {
      case "delete":
        setOpenDeleteModal((prev) => ({
          ...prev,
          [`delete-${movieId}`]: false,
        }));

        if (args["action"] === "confirm") {
          try {
            const response = await deleteMovie(movieId);
            if (response.status === 204) {
              setMovies((prevRooms) =>
                prevRooms.filter((room) => room.id !== movieId)
              );
              showSnackbar("Película eliminada correctamente", "success");
            }
          } catch (error) {
            showSnackbar(
              "Error al eliminar la película, por favor, contacta con soporte o intenta de nuevo.",
              "error"
            );
          }
        }
        break;

      default:
        break;
    }
  };

  const handleOpenMenu = (event, movieId) => {
    setAnchorElActions({
      anchorEl: event.currentTarget,
      movieId: movieId,
    });
  };

  const handleMenuItemActions = (action, movieId) => {
    setAnchorElActions({ anchorEl: null, userId: null });

    switch (action) {
      case "edit":
        navigate(`/movies/edit/${movieId}`);
        break;

      case "delete":
        setOpenDeleteModal((prev) => ({
          ...prev,
          [`delete-${movieId}`]: true,
        }));
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Breadcrumbs>
        <Typography>Inicio</Typography>
        <Typography>Lista de películas</Typography>
      </Breadcrumbs>
      {user?.role === "admin" && (
        <Box display="flex" justifyContent="right" mb={2}>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/movies/create")}
            >
              Crear película
            </Button>
          </Box>
        </Box>
      )}
      <ImageList>
        {movies.map((movie) => (
          <ImageListItem key={movie.id}>
            <img
              src={`${API_URL}/${movie.image}`}
              alt={movie.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={movie.title}
              subtitle={movie.description}
              actionIcon={
                user?.role === "admin" ? (
                  <>
                    <IconButton
                      variant="text"
                      size="small"
                      sx={{ mr: 2 }}
                      onClick={(event) => handleOpenMenu(event, movie.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id={`actions-${movie.id}`}
                      anchorEl={anchorElActions.anchorEl}
                      open={open && anchorElActions.movieId === movie.id}
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
                        key={`edit-${movie.id}`}
                        onClick={() => handleMenuItemActions("edit", movie.id)}
                      >
                        <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Editar
                      </MenuItem>
                      <MenuItem
                        key={`delete-${movie.id}`}
                        sx={{ color: "error.main" }}
                        onClick={() =>
                          handleMenuItemActions("delete", movie.id)
                        }
                      >
                        <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Eliminar
                      </MenuItem>
                    </Menu>
                    <ConfirmationModal
                      key={`delete-${movie.id}`}
                      open={openDeleteModal[`delete-${movie.id}`]}
                      onClose={() =>
                        handleCloseModal("delete", movie.id, {
                          action: "cancel",
                        })
                      }
                      onConfirm={() =>
                        handleCloseModal("delete", movie.id, {
                          action: "confirm",
                        })
                      }
                      title="¿Estás seguro de hacer esto?"
                      description="Esta acción no se puede deshacer. Si eliminas esta película, no podrás recuperarla."
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ mr: 2 }}
                      onClick={() => navigate(`/movies/schedules/${movie.id}`)}
                    >
                      Ver cartelera
                    </Button>
                  </>
                )
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
