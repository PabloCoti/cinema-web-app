import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";

import { getMyReservations } from "../../api/reservationService";
import { SnackbarContext } from "../../contexts/SnackbarContext";

import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

function groupReservationsByCreatedAt(reservations) {
  const groups = {};
  reservations.forEach((r) => {
    const key = r.createdAt;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return Object.entries(groups)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .map(([createdAt, group]) => ({ createdAt, group }));
}

export default function ListReservations() {
  const [reservations, setReservations] = useState([]);
  const { showSnackbar } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getMyReservations();
        setReservations(res.data);
      } catch (err) {
        showSnackbar("Error al cargar reservaciones", "error");
      }
    };
    fetchReservations();
  }, [showSnackbar]);

  const grouped = groupReservationsByCreatedAt(reservations);

  return (
    <Box maxWidth="md" mx="auto" my={4}>
      <Typography variant="h4" mb={3}>
        Mis reservaciones
      </Typography>
      <Grid container direction="column" spacing={3}>
        {grouped.map(({ createdAt, group }) => {
          const first = group[0];
          const movie = first.Schedule.Movie;
          const schedule = first.Schedule;
          const seats = group
            .map((r) => `${r.Seat.row}${r.Seat.number}`)
            .join(", ");
          return (
            <Grid item key={createdAt}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  boxShadow: 2,
                  borderRadius: 2,
                  minHeight: 140,
                  overflow: "visible",
                  px: 2,
                  py: 1,
                }}
              >
                <CardMedia
                  component="img"
                  image={`${API_URL}/${movie.image}`}
                  alt={movie.title}
                  sx={{
                    width: 100,
                    height: 140,
                    borderRadius: 2,
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
                <CardContent sx={{ flex: 1, minWidth: 0, py: 1 }}>
                  <Typography variant="h6" noWrap>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {movie.Genre?.name} | {movie.duration} min
                  </Typography>
                  <Divider sx={{ my: 1 }} />
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
                  <Typography variant="caption" color="text.secondary">
                    Reservado el: {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </CardContent>
                <Box sx={{ ml: "auto", pr: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate(
                        `/reservations/view/${group.map((r) => r.id).join(",")}`
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
        {reservations.length === 0 && (
          <Typography variant="body1" color="text.secondary" mt={4}>
            No tienes reservaciones.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
