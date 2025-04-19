import { useState, useContext, useEffect } from "react";

import Layout from "../../components/Layout";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { listRooms, getRoom, updateRoom } from "../../api/roomService";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import FormControl from "@mui/material/FormControl";
import EventSeatIcon from "@mui/icons-material/EventSeat";

export default function EditRoom() {
  const [rows, setRows] = useState(10);
  const roomId = window.location.pathname.split("/").pop();

  const [formError, setFormError] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [codeErrorMessage, setCodeErrorMessage] = useState("");

  const [screenTypeError, setScreenTypeError] = useState(false);
  const [screenTypeErrorMessage, setScreenTypeErrorMessage] = useState("");

  const [soundSystemError, setSoundSystemError] = useState(false);
  const [soundSystemErrorMessage, setSoundSystemErrorMessage] = useState("");

  const [seats, setSeats] = useState(
    Array.from({ length: 10 }, () => Array(10).fill(true))
  );

  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (roomId) {
        try {
          const response = await getRoom(roomId);

          if (response.status === 200) {
            const roomData = await response.data;

            document.getElementById("code").value = roomData.code || "";
            document.getElementById("screenType").value =
              roomData.screenType || "";
            document.getElementById("soundSystem").value =
              roomData.soundSystem || "";

            const maxRow = Math.max(
              ...roomData.Seats.map((seat) => seat.row.charCodeAt(0) - 65)
            );

            const seatMatrix = Array.from({ length: maxRow + 1 }, () => []);

            roomData.Seats.forEach((seat) => {
              const rowIndex = seat.row.charCodeAt(0) - 65;
              const colIndex = seat.number - 1;
              seatMatrix[rowIndex][colIndex] = seat.isActive;
            });

            setSeats(seatMatrix);
            setRows(seatMatrix.length || 10);
          }
        } catch (error) {
          console.error("Error fetching room data:", error);
        }
      }
    };

    fetchRoomData();
  }, [roomId]);

  const addColumnToRow = (rowIndex) => {
    setSeats((prevSeats) => {
      const updatedSeats = [...prevSeats];
      updatedSeats[rowIndex] = [...updatedSeats[rowIndex], true];
      return updatedSeats;
    });
  };

  const removeColumnFromRow = (rowIndex) => {
    setSeats((prevSeats) => {
      const updatedSeats = [...prevSeats];
      if (updatedSeats[rowIndex].length > 0) {
        updatedSeats[rowIndex] = updatedSeats[rowIndex].slice(0, -1);
      }
      return updatedSeats;
    });
  };

  const addRow = () => {
    setSeats((prevSeats) => [...prevSeats, []]);
    setRows(rows + 1);
  };

  const removeRow = () => {
    if (rows > 1) {
      setSeats((prevSeats) => prevSeats.slice(0, -1));
      setRows(rows - 1);
    }
  };

  const toggleSeat = (row, col) => {
    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seatRow, rowIndex) =>
        rowIndex === row
          ? seatRow.map((seat, colIndex) => (colIndex === col ? !seat : seat))
          : seatRow
      );
      return updatedSeats;
    });
  };

  const validateInputs = async () => {
    let error = false;

    const code = document.getElementById("code").value;
    const screenType = document.getElementById("screenType").value;
    const soundSystem = document.getElementById("soundSystem").value;

    const checkCodeUnique = async () => {
      try {
        const response = await listRooms({
          code: code,
        });

        if (
          response.data.length > 0 &&
          parseInt(response.data[0].id) !== parseInt(roomId)
        ) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    };

    if (!code || code.length < 1) {
      error = true;
      setCodeError(true);
      setCodeErrorMessage("Por favor, ingresa el código de la sala");
    } else {
      const isCodeUnique = await checkCodeUnique();
      if (!isCodeUnique) {
        error = true;
        setCodeError(true);
        setCodeErrorMessage("El código de la sala ya está en uso");
      } else {
        setCodeError(false);
        setCodeErrorMessage("");
      }
    }

    if (!screenType || screenType.length < 1) {
      error = true;

      setScreenTypeError(true);
      setScreenTypeErrorMessage("Por favor, ingresa el tipo de pantalla");
    } else {
      setScreenTypeError(false);
      setScreenTypeErrorMessage("");
    }

    if (!soundSystem || soundSystem.length < 1) {
      error = true;
      setSoundSystemError(true);
      setSoundSystemErrorMessage("Por favor, ingresa el sistema de sonido");
    } else {
      setSoundSystemError(false);
      setSoundSystemErrorMessage("");
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

    const seatData = seats.map((row, rowIndex) =>
      row.map((isAvailable, colIndex) => ({
        row: String.fromCharCode(65 + rowIndex),
        number: colIndex + 1,
        isActive: isAvailable,
      }))
    );

    let roomData = new FormData(event.target);
    roomData = Object.fromEntries(roomData.entries());

    const totalSeats = seats.reduce((acc, row) => acc + row.length, 0);
    roomData.capacity = totalSeats;

    try {
      const response = await updateRoom(roomId, roomData, seatData);

      if (response.status === 200) {
        showSnackbar("Sala actualizada con éxito", "success");
      }
    } catch (error) {
      showSnackbar(
        "Error al actualizar la sala, por favor, contacta con soporte o intenta más tarde",
        "error"
      );
    }
  };

  return (
    <Layout>
      <Breadcrumbs>
        <Typography>Salas</Typography>
        <Typography>Editar sala</Typography>
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
          <FormLabel htmlFor="code">Código de sala</FormLabel>
          <TextField
            id="code"
            name="code"
            variant="outlined"
            placeholder="Ingresa el código de la sala"
            autoComplete="off"
            autoFocus
            required
            fullWidth
            error={codeError}
            helperText={codeError ? codeErrorMessage : ""}
            color={codeError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="screenType">Tipo de pantalla</FormLabel>
          <TextField
            id="screenType"
            name="screenType"
            variant="outlined"
            placeholder="Ingresa el tipo de pantalla de la sala"
            autoComplete="screenType"
            autoFocus
            required
            fullWidth
            error={screenTypeError}
            helperText={screenTypeError ? screenTypeErrorMessage : ""}
            color={screenTypeError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="soundSystem">Sistema de sonido</FormLabel>
          <TextField
            id="soundSystem"
            name="soundSystem"
            variant="outlined"
            placeholder="Ingresa el sistema de sonido de la sala"
            autoComplete="soundSystem"
            autoFocus
            required
            fullWidth
            error={soundSystemError}
            helperText={soundSystemError ? soundSystemErrorMessage : ""}
            color={soundSystemError ? "error" : "primary"}
          />
        </FormControl>
        <Typography variant="h6">Configurar Asientos</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={removeRow}>
            Eliminar Fila
          </Button>
          <Button variant="contained" onClick={addRow}>
            Agregar Fila
          </Button>
        </Box>
        {seats.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">
              Fila {String.fromCharCode(65 + rowIndex)}
            </Typography>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => removeColumnFromRow(rowIndex)}
                  sx={{ minWidth: 40, minHeight: 40 }}
                >
                  -
                </Button>
              </Grid>
              {row.map((isAvailable, colIndex) => (
                <Grid item key={`${rowIndex}-${colIndex}`}>
                  <Button
                    variant="contained"
                    color={isAvailable ? "success" : "error"}
                    onClick={() => toggleSeat(rowIndex, colIndex)}
                    sx={{
                      minWidth: 40,
                      minHeight: 40,
                      padding: 0,
                    }}
                  >
                    <EventSeatIcon />
                  </Button>
                </Grid>
              ))}
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addColumnToRow(rowIndex)}
                  sx={{ minWidth: 40, minHeight: 40 }}
                >
                  +
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button type="submit" variant="contained" onClick={validateInputs}>
          Actualizar sala
        </Button>
      </Box>
    </Layout>
  );
}
