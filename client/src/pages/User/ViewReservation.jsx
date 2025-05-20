import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { getReservationById } from "../../api/reservationService";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function ViewReservation() {
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const ids = id.split(",");
        const res = await getReservationById(ids[0]);
        let group = [res.data];
        if (res.data.createdAt) {
          group = [res.data, ...(res.data.group || []).filter(r => r.id !== res.data.id)];
        }
        setReservations(group);
        setQrUrl(res.data.qrUrl);
      } catch (err) {
        showSnackbar("Error al cargar la reservación", "error");
      }
      setLoading(false);
    };
    fetchReservations();
  }, [id, showSnackbar]);

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

  if (!reservations.length) return null;

  const first = reservations[0];
  const movie = first.Schedule.Movie;
  const schedule = first.Schedule;
  const seats = reservations.map((r) => `${r.Seat.row}${r.Seat.number}`).join(", ");

  return (
    <Box maxWidth="md" mx="auto" my={4}>
      <Card sx={{ display: "flex", mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardMedia
          component="img"
          image={`${API_URL}/${movie.image}`}
          alt={movie.title}
          sx={{
            width: 120,
            height: 180,
            borderRadius: 2,
            objectFit: "cover",
            mr: 2,
          }}
        />
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5">{movie.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {movie.Genre?.name} | {movie.duration} min
          </Typography>
          <Typography variant="body2" mt={1}>
            {movie.description}
          </Typography>
        </Box>
      </Card>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight={600}>
            Detalles de la reservación
          </Typography>
          <Typography variant="body2">
            Sala: <b>{schedule.Room.code}</b>
          </Typography>
          <Typography variant="body2">
            Fecha: <b>{new Date(schedule.date).toLocaleDateString()}</b>
          </Typography>
          <Typography variant="body2">
            Hora: <b>{schedule.startTime}</b>
          </Typography>
          <Typography variant="body2">
            Asientos: <b>{seats}</b>
          </Typography>
          <Typography variant="body2">
            Precio total: <b>Q. {schedule.price * reservations.length}</b>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            QR de tu reservación
          </Typography>
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="QR Reservación"
              style={{ width: 180, height: 180 }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              QR no disponible.
            </Typography>
          )}
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => {
              if (qrUrl) {
                const link = document.createElement("a");
                link.href = qrUrl;
                link.download = "boleto_qr.png";
                link.click();
              }
            }}
            disabled={!qrUrl}
          >
            Descargar QR
          </Button>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent={{ xs: "center", sm: "flex-end" }}
        mt={4}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/reservations")}
        >
          Volver a mis reservaciones
        </Button>
      </Box>
    </Box>
  );
}
