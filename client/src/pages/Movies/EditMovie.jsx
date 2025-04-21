import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router";

import {
  getMovie,
  updateMovieData,
  updateMovieImage,
} from "../../api/movieService";
import { listMovieGenres } from "../../api/movieGenreService";
import { SnackbarContext } from "../../contexts/SnackbarContext";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const StyledUploadBox = styled(Box)(({ theme }) => ({
  border: "2px dashed",
  borderColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[600]
      : theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.text.primary,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[200],
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function EditMovie() {
  const movieId = window.location.pathname.split("/").pop();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showSnackbar } = useContext(SnackbarContext);

  const [movieData, setMovieData] = useState({});
  const [movieGenres, setMovieGenres] = useState([]);

  const [formError, setFormError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [genreError, setGenreError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [durationError, setDurationError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [releaseDateError, setReleaseDateError] = useState(false);

  const [releaseDate, setReleaseDate] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [genreErrorMessage, setGenreErrorMessage] = useState("");
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [selectedMovieGenre, setSelectedMovieGenre] = useState("");
  const [durationErrorMessage, setDurationErrorMessage] = useState("");
  const [descriptionErrorMessage, setTitleErDescriptionssage] = useState("");
  const [releaseDateErrorMessage, setReleaseDateErrorMessage] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      if (movieId) {
        try {
          const response = await getMovie(movieId);

          if (response.status === 200) {
            const movieData = response.data;
            setMovieData(movieData);

            document.getElementById("title").value = movieData.title;
            document.getElementById("description").value =
              movieData.description;
            document.getElementById("duration").value = movieData.duration;

            setReleaseDate(
              new Date(movieData.releaseDate).toISOString().split("T")[0]
            );
            setSelectedMovieGenre(movieData.genreId);
            setSelectedFileName(movieData.image?.split("/").pop() || "");
          }
        } catch (error) {
          console.error("Error fetching movie data:", error);
        }
      }
    };

    fetchMovieData();
  }, [movieId]);

  useEffect(() => {
    const fetchMovieGenres = async () => {
      const response = await listMovieGenres();
      setMovieGenres(response.data);
    };

    fetchMovieGenres();
  }, []);

  const validateInputs = () => {
    let error = false;

    const title = document.getElementById("title").value;
    const image = selectedFileName;
    const duration = document.getElementById("duration").value;
    const description = document.getElementById("description").value;
    const releaseDate = document.getElementById("releaseDate").value;

    if (!title || title.length < 1) {
      error = true;
      setTitleError(true);
      setTitleErrorMessage("El nombre de la película es obligatorio.");
    } else {
      setTitleError(false);
      setTitleErrorMessage("");
    }

    if (!description || description.length < 1) {
      error = true;
      setDescriptionError(true);
      setTitleErDescriptionssage(
        "La descripción de la película es obligatoria."
      );
    } else {
      setDescriptionError(false);
      setTitleErDescriptionssage("");
    }

    if (!selectedMovieGenre || selectedMovieGenre.length < 1) {
      error = true;
      setGenreError(true);
      setGenreErrorMessage("El género de la película es obligatorio.");
    } else {
      setGenreError(false);
      setGenreErrorMessage("");
    }

    if (!duration || duration.length < 1) {
      error = true;
      setDurationError(true);
      setDurationErrorMessage("La duración de la película es obligatoria.");
    } else {
      setDurationError(false);
      setDurationErrorMessage("");
    }

    if (!releaseDate) {
      error = true;
      setReleaseDateError(true);
      setReleaseDateErrorMessage("La fecha de lanzamiento es obligatoria.");
    } else {
      setReleaseDateError(false);
      setReleaseDateErrorMessage("");
    }

    if (!image) {
      error = true;
      setImageError(true);
      setImageErrorMessage("La imagen de la película es obligatoria.");
    } else {
      setImageError(false);
      setImageErrorMessage("");
    }

    setFormError(error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formError) {
      showSnackbar(
        "Por favor, completa todos los campos de forma correcta",
        "error"
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    try {
      const { image, ...formDataWithoutImage } = Object.fromEntries(formData);
      const response = await updateMovieData(movieId, formDataWithoutImage);

      if (movieData.image?.split("/").pop() !== selectedFileName) {
        const imageFormData = new FormData();
        imageFormData.append("image", fileInputRef.current.files[0]);
        await updateMovieImage(movieId, imageFormData);
      }

      if (response.status === 200) {
        showSnackbar("Película actualizada con éxito", "success");
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating movie:", error.message);

      showSnackbar(
        "Error al actualizar la película, por favor, contacta con soporte o intenta nuevamente.F",
        "error"
      );
    }
  };

  return (
    <>
      <Breadcrumbs>
        <Typography>Inicio</Typography>
        <Typography>Crear película</Typography>
      </Breadcrumbs>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="title">Nombre</FormLabel>
          <TextField
            id="title"
            name="title"
            variant="outlined"
            placeholder="Ingresa el nombre de la película"
            autoComplete="off"
            autoFocus
            required
            fullWidth
            error={titleError}
            helperText={titleError ? titleErrorMessage : ""}
            color={titleError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Descripción</FormLabel>
          <TextField
            id="description"
            name="description"
            variant="outlined"
            placeholder="Ingresa el nombre de la película"
            autoComplete="off"
            autoFocus
            required
            fullWidth
            error={descriptionError}
            helperText={descriptionError ? descriptionErrorMessage : ""}
            color={descriptionError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="genreId">Género</FormLabel>
          <Select
            id="genreId"
            name="genreId"
            value={selectedMovieGenre}
            onChange={(event) => {
              setSelectedMovieGenre(event.target.value);
            }}
            fullWidth
            error={genreError}
            color={genreError ? "error" : "primary"}
          >
            {movieGenres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
          {genreError && (
            <Typography variant="caption" color="error" ml={1}>
              {genreErrorMessage}
            </Typography>
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="duration">Duración (min)</FormLabel>
          <TextField
            id="duration"
            type="number"
            name="duration"
            variant="outlined"
            placeholder="Ingresa la duración en minutos de la película"
            autoComplete="off"
            autoFocus
            required
            fullWidth
            error={durationError}
            helperText={durationError ? durationErrorMessage : ""}
            color={durationError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="releaseDate">Fecha de lanzamiento</FormLabel>
          <TextField
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(event) => setReleaseDate(event.target.value)}
            fullWidth
            error={releaseDateError}
            helperText={releaseDateError ? releaseDateErrorMessage : ""}
            color={releaseDateError ? "error" : "primary"}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="image">Imagen</FormLabel>
          <StyledUploadBox
            onClick={() => fileInputRef.current.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file) {
                setSelectedFileName(file.name);
                fileInputRef.current.files = event.dataTransfer.files;
              }
            }}
          >
            <Typography variant="body2">
              {selectedFileName ||
                "Arrastra y suelta una imagen aquí o haz clic para seleccionar"}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => fileInputRef.current.click()}
            >
              Seleccionar archivo
            </Button>
            <input
              id="image"
              name="image"
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0];
                setSelectedFileName(file ? file.name : "");
                fileInputRef.current.files = event.target.files;
              }}
            />
          </StyledUploadBox>
          {selectedFileName && (
            <Typography variant="caption" ml={1}>
              Archivo seleccionado: {selectedFileName}
            </Typography>
          )}
          {imageError && (
            <Typography variant="caption" color="error" ml={1}>
              {imageErrorMessage}
            </Typography>
          )}
        </FormControl>
        <Button type="submit" variant="contained" onClick={validateInputs}>
          Crear película
        </Button>
      </Box>
    </>
  );
}
