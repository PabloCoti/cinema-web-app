import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";

import { getRoom } from "../../api/roomService";
import { getSchedule } from "../../api/scheduleService";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  createReservation,
  getReservationsBySchedule,
} from "../../api/reservationService";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CircularProgress from "@mui/material/CircularProgress";

export default function CreateReservation() {
  const scheduleId = window.location.pathname.split("/")[3];
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentData, setPaymentData] = useState({
    name: "",
    card: "",
    exp: "",
    cvc: "",
  });
  const [paymentError, setPaymentError] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const scheduleRes = await getSchedule(scheduleId);
        setSchedule(scheduleRes.data);
        const roomRes = await getRoom(scheduleRes.data.Room.id);

        const reservationsRes = await getReservationsBySchedule(scheduleId);
        const reservedSeats = reservationsRes.data.map((r) => r.seatId);

        const seatMatrix = [];
        const maxRow = Math.max(
          ...roomRes.data.Seats.map((seat) => seat.row.charCodeAt(0) - 65)
        );
        for (let i = 0; i <= maxRow; i++) {
          seatMatrix[i] = [];
        }
        roomRes.data.Seats.forEach((seat) => {
          const rowIndex = seat.row.charCodeAt(0) - 65;
          const colIndex = seat.number - 1;
          let state = "available";
          if (!seat.isActive) state = "disabled";
          else if (reservedSeats.includes(seat.id)) state = "occupied";
          seatMatrix[rowIndex][colIndex] = {
            ...seat,
            state,
          };
        });
        setSeats(seatMatrix);
      } catch (err) {
        showSnackbar("Error cargando información de la sala/función", "error");
      }
      setLoading(false);
    };
    fetchData();
  }, [scheduleId]);

  const handleTicketCountChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    setTicketCount(value);
    setSelectedSeats([]);
  };

  const handleToggleSeat = (rowIdx, colIdx) => {
    const seat = seats[rowIdx][colIdx];
    if (seat.state !== "available") return;
    if (
      selectedSeats.some((s) => s.row === seat.row && s.number === seat.number)
    ) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) => !(s.row === seat.row && s.number === seat.number)
        )
      );
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    if (name === "exp") {
      let cleaned = value.replace(/\D/g, "").slice(0, 4);

      if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
      }
      setPaymentData({ ...paymentData, exp: cleaned });
    } else {
      setPaymentData({ ...paymentData, [name]: value });
    }
  };

  const validatePayment = () => {
    const errors = {};
    if (!paymentData.name) errors.name = "Nombre requerido";
    if (!paymentData.card || paymentData.card.length < 16)
      errors.card = "Tarjeta inválida";
    if (!paymentData.exp || !/^\d{2}\/\d{2}$/.test(paymentData.exp))
      errors.exp = "Formato MM/AA";
    if (!paymentData.cvc || paymentData.cvc.length < 3)
      errors.cvc = "CVC inválido";
    setPaymentError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!ticketCount || ticketCount < 1) {
        showSnackbar("Selecciona al menos un boleto", "warning");
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (selectedSeats.length !== ticketCount) {
        showSnackbar(
          "Selecciona la cantidad de asientos igual a los boletos",
          "warning"
        );
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validatePayment()) return;
    setSubmitting(true);
    try {
      const seatIds = selectedSeats.map((s) => s.id);
      const res = await createReservation({
        scheduleId,
        seatIds,
        payment: paymentData,
      });
      setQrUrl(res.data.qrUrl);
      navigate("/reservations/qr", { state: { qrUrl: res.data.qrUrl } });
      showSnackbar("Reservación realizada con éxito", "success");
    } catch (err) {
      console.error("Error reservando boletos", err.message);
      showSnackbar("Error al crear la reservación", "error");
    }
    setSubmitting(false);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "boleto_qr.png";
    link.click();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  const steps = [
    "Selecciona la cantidad de boletos",
    "Selecciona tus asientos",
    "Pago",
  ];

  return (
    <Box maxWidth="md" mx="auto" my={4}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant="h4" mb={2}>
        Reservar boletos
      </Typography>
      <Typography variant="subtitle1" mb={2}>
        {schedule?.Movie?.title} - {schedule?.Room?.code} -{" "}
        {new Date(schedule?.date).toLocaleDateString()} {schedule?.startTime}
      </Typography>
      {activeStep === 0 && (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Cantidad de boletos</FormLabel>
            <TextField
              type="number"
              value={ticketCount}
              onChange={handleTicketCountChange}
              inputProps={{ min: 1, max: 10 }}
              sx={{ width: 120 }}
            />
          </FormControl>
          <Typography variant="h6" mb={1}>
            Subtotal: Q. {(schedule?.price || 0) * ticketCount}
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="contained" color="primary" type="submit">
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          <Typography variant="h6" mb={1}>
            Selecciona tus asientos
          </Typography>
          <Box sx={{ overflowX: "auto", mb: 2 }}>
            {seats.map((row, rowIdx) => (
              <Box key={rowIdx} display="flex" alignItems="center" mb={1}>
                <Typography sx={{ width: 24 }}>
                  {String.fromCharCode(65 + rowIdx)}
                </Typography>
                <Grid container spacing={1} wrap="nowrap">
                  {row.map((seat, colIdx) => {
                    let color = "primary";
                    let disabled = false;
                    if (seat.state === "disabled") {
                      color = "inherit";
                      disabled = true;
                    } else if (seat.state === "occupied") {
                      color = "error";
                      disabled = true;
                    } else if (
                      selectedSeats.some(
                        (s) => s.row === seat.row && s.number === seat.number
                      )
                    ) {
                      color = "success";
                    }
                    return (
                      <Grid item key={colIdx}>
                        <Button
                          variant="contained"
                          color={color}
                          disabled={disabled}
                          onClick={() => handleToggleSeat(rowIdx, colIdx)}
                          sx={{
                            minWidth: 36,
                            minHeight: 36,
                            p: 0,
                            opacity: disabled ? 0.4 : 1,
                            border: selectedSeats.some(
                              (s) =>
                                s.row === seat.row && s.number === seat.number
                            )
                              ? "2px solid #2e7d32"
                              : undefined,
                          }}
                        >
                          <EventSeatIcon fontSize="small" />
                          <Typography variant="caption">
                            {seat.number}
                          </Typography>
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
            <Box mt={1} display="flex" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <EventSeatIcon color="success" fontSize="small" />{" "}
                <Typography variant="caption">Seleccionado</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <EventSeatIcon color="primary" fontSize="small" />{" "}
                <Typography variant="caption">Disponible</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <EventSeatIcon color="error" fontSize="small" />{" "}
                <Typography variant="caption">Ocupado</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <EventSeatIcon
                  color="inherit"
                  fontSize="small"
                  sx={{ opacity: 0.4 }}
                />{" "}
                <Typography variant="caption">No disponible</Typography>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
            <Button variant="outlined" onClick={handleBack}>
              Atrás
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (selectedSeats.length !== ticketCount) {
                  showSnackbar(
                    "Selecciona la cantidad de asientos igual a los boletos",
                    "warning"
                  );
                } else {
                  handleNext();
                }
              }}
            >
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
      {activeStep === 2 && (
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" mb={1}>
            Pago
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre en la tarjeta"
                name="name"
                value={paymentData.name}
                onChange={handlePaymentChange}
                error={!!paymentError.name}
                helperText={paymentError.name}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de tarjeta"
                name="card"
                value={paymentData.card}
                onChange={handlePaymentChange}
                error={!!paymentError.card}
                helperText={paymentError.card}
                fullWidth
                required
                inputProps={{ maxLength: 16 }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Expiración (MM/AA)"
                name="exp"
                value={paymentData.exp}
                onChange={handlePaymentChange}
                error={!!paymentError.exp}
                helperText={paymentError.exp}
                fullWidth
                required
                inputProps={{ maxLength: 5, inputMode: "numeric" }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="CVC"
                name="cvc"
                value={paymentData.cvc}
                onChange={handlePaymentChange}
                error={!!paymentError.cvc}
                helperText={paymentError.cvc}
                fullWidth
                required
                inputProps={{ maxLength: 4 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total a pagar"
                value={`${(schedule?.price || 0) * ticketCount}`}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">Q.</InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
            <Button variant="outlined" onClick={handleBack}>
              Atrás
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : "Reservar"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
