import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import { formatDate } from "../../utils/dateTime";
import { listRooms } from "../../api/roomService";
import { listMovies } from "../../api/movieService";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { getSchedule, updateSchedule } from "../../api/scheduleService";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function EditSchedule() {
  const navigate = useNavigate();
  const scheduleId = window.location.pathname.split("/").pop();

  const { showSnackbar } = useContext(SnackbarContext);

  const [date, setDate] = useState("");
  const [rooms, setRooms] = useState([]);
  const [price, setPrice] = useState("");
  const [roomId, setRoomId] = useState("");
  const [movies, setMovies] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startTime, setStartTime] = useState("");

  const [dateError, setDateError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [roomIdError, setRoomIdError] = useState(false);
  const [movieIdError, setMovieIdError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);

  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [priceErrorMessage, setPriceErrorMessage] = useState("");
  const [roomIdErrorMessage, setRoomIdErrorMessage] = useState("");
  const [movieIdErrorMessage, setMovieIdErrorMessage] = useState("");
  const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("");
  const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await getSchedule(scheduleId);

      setPrice(response.data.price);
      setRoomId(response.data.Room.id);
      setEndTime(response.data.endTime);
      setMovieId(response.data.Movie.id);
      setIsActive(response.data.isActive);
      setStartTime(response.data.startTime);
      setDate(formatDate(response.data.date));
    };

    const fetchRooms = async () => {
      const response = await listRooms();
      setRooms(response.data);
    };

    const fetchMovies = async () => {
      const response = await listMovies();
      setMovies(response.data);
    };

    fetchRooms();
    fetchMovies();
    fetchSchedule();
  }, [scheduleId]);

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);

    if (!endTime && !!movieId) {
      const selectedMovie = movies.find((movie) => movie.id === movieId);
      if (selectedMovie && selectedMovie.duration) {
        const startTimeDate = new Date(`1970-01-01T${event.target.value}:00`);
        const endTimeDate = new Date(
          startTimeDate.getTime() + selectedMovie.duration * 60000
        );
        const formattedEndTime = endTimeDate.toTimeString().slice(0, 5);
        setEndTime(formattedEndTime);
      }
    }
  };

  const validateInputs = () => {
    let error = false;

    if (!roomId || roomId.length < 1) {
      error = true;
      setRoomIdError(true);
      setRoomIdErrorMessage("Seleccione una sala");
    } else {
      setRoomIdError(false);
      setRoomIdErrorMessage("");
    }

    if (!movieId || movieId.length < 1) {
      error = true;
      setMovieIdError(true);
      setMovieIdErrorMessage("Seleccione una película");
    } else {
      setMovieIdError(false);
      setMovieIdErrorMessage("");
    }

    if (!date || date.length < 1) {
      error = true;
      setDateError(true);
      setDateErrorMessage("Seleccione una fecha de la función");
    } else {
      setDateError(false);
      setDateErrorMessage("");
    }

    if (!startTime || startTime.length < 1) {
      error = true;
      setStartTimeError(true);
      setStartTimeErrorMessage("Seleccione una hora de inicio");
    } else {
      setStartTimeError(false);
      setStartTimeErrorMessage("");
    }

    if (!endTime || endTime.length < 1) {
      error = true;
      setEndTimeError(true);
      setEndTimeErrorMessage("Seleccione una hora de fin");
    } else {
      setEndTimeError(false);
      setEndTimeErrorMessage("");
    }

    if (!price || price.length < 1) {
      error = true;
      setPriceError(true);
      setPriceErrorMessage("Inserte un precio válido");
    } else {
      setPriceError(false);
      setPriceErrorMessage("");
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
      const response = await updateSchedule(scheduleId, formData);
      if (response.status === 200) {
        showSnackbar("Función actualizada con éxito", "success");
        navigate("/schedules/list");
      }
    } catch (error) {
      if (error.status === 400) {
        showSnackbar(
          "Error al actualizar la función, parece que ya tienes una función en esa sala y horario.",
          "error"
        );
      } else {
        showSnackbar(
          "Error al actualizar la película, por favor, contacta con soporte o intenta nuevamente.F",
          "error"
        );
      }
    }
  };

  return (
    <>
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
          <FormLabel htmlFor="roomId">Sala - capacidad</FormLabel>
          <Select
            id="roomId"
            name="roomId"
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            fullWidth
            error={roomIdError}
            color={roomIdError ? "error" : "primary"}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.code} - {room.capacity}
              </MenuItem>
            ))}
            {roomIdError && (
              <Typography variant="caption" color="error" ml={1}>
                {roomIdErrorMessage}
              </Typography>
            )}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="movieId">Película</FormLabel>
          <Select
            id="movieId"
            name="movieId"
            value={movieId}
            onChange={(event) => setMovieId(event.target.value)}
            fullWidth
            error={movieIdError}
            color={movieIdError ? "error" : "primary"}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id}>
                {movie.title}
              </MenuItem>
            ))}
            {movieIdError && (
              <Typography variant="caption" color="error" ml={1}>
                {movieIdErrorMessage}
              </Typography>
            )}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="date">Fecha de la función</FormLabel>
          <TextField
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            fullWidth
            error={dateError}
            helperText={dateError ? dateErrorMessage : ""}
            color={dateError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="startTime">Hora de inicio</FormLabel>
          <TextField
            id="startTime"
            name="startTime"
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            fullWidth
            error={startTimeError}
            helperText={startTimeError ? startTimeErrorMessage : ""}
            color={startTimeError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="endTime">Hora de fin</FormLabel>
          <TextField
            id="endTime"
            name="endTime"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            fullWidth
            error={endTimeError}
            helperText={endTimeError ? endTimeErrorMessage : ""}
            color={endTimeError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="price">Precio</FormLabel>
          <TextField
            id="price"
            name="price"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            fullWidth
            error={priceError}
            helperText={priceError ? priceErrorMessage : ""}
            color={priceError ? "error" : "primary"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Q.</InputAdornment>
                ),
              },
            }}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox value={isActive} color="primary" name="isActive" />
          }
          label="Activa"
        />
        <Button type="submit" variant="contained" onClick={validateInputs}>
          Crear función
        </Button>
      </Box>
    </>
  );
}
