import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router";
import { getMovie } from "../../api/movieService";
import { useAuth } from "../../contexts/AuthContext";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { getMovieSchedules } from "../../api/scheduleService";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import CardMedia from "@mui/material/CardMedia";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";

export default function ListMovieSchedules() {
  const API_URL = process.env.REACT_APP_API_URL;
  const movieId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar } = useContext(SnackbarContext);

  const [date, setDate] = useState("");
  const [movie, setMovie] = useState(null);
  const [dates, setDates] = useState(null);
  const [allSchedules, setAllSchedules] = useState(null);
  const [filteredSchedules, setFilteredSchedules] = useState(null);

  useEffect(() => {
    const fetchMovieSchedules = async () => {
      try {
        const response = await getMovieSchedules(movieId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fiveDaysLater = new Date(today);
        fiveDaysLater.setDate(today.getDate() + 5);

        setDates(
          response.data
            .map((schedule) => new Date(schedule.date))
            .filter((d) => d >= today && d <= fiveDaysLater)
            .map((d) => d.toISOString().split("T")[0])
            .filter((v, i, arr) => arr.indexOf(v) === i)
        );

        const validSchedules = response.data.filter((schedule) => {
          const scheduleDate = new Date(schedule.date);
          scheduleDate.setHours(0, 0, 0, 0);
          return scheduleDate >= today && scheduleDate <= fiveDaysLater;
        });
        setAllSchedules(validSchedules);
      } catch (error) {
        console.error("Error fetching movie schedules:", error);
      }
    };

    const fetchMovie = async () => {
      try {
        const response = await getMovie(movieId);

        if (response.status === 200) {
          setMovie(response.data);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
    fetchMovieSchedules();
  }, [movieId]);

  useEffect(() => {
    if (!allSchedules) {
      setFilteredSchedules(null);
      return;
    }
    if (!date) {
      setFilteredSchedules(allSchedules);
    } else {
      setFilteredSchedules(
        allSchedules.filter(
          (schedule) =>
            new Date(schedule.date).toISOString().split("T")[0] === date
        )
      );
    }
  }, [allSchedules, date]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} sm={4}>
            <Card>
              <CardMedia
                component="img"
                image={`${API_URL}/${movie?.image}`}
                alt={movie?.title}
              />
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {movie?.title}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {movie?.Genre.name} | {movie?.duration} min
              </Typography>
              <Typography variant="body1" paragraph>
                {movie?.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Filtrar horarios por fecha
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Fecha</InputLabel>
              <Select value={date} onChange={(e) => setDate(e.target.value)}>
                {dates?.map((f) => (
                  <MenuItem key={f} value={f}>
                    {new Date(f).toLocaleDateString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6">Horarios disponibles</Typography>
          {filteredSchedules?.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay horarios disponibles para la selección actual.
            </Typography>
          ) : (
            <Grid container spacing={2} mt={1}>
              {filteredSchedules?.map((h, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2">
                        {new Date(h.date).toLocaleDateString()}
                      </Typography>
                      <Box
                        component="button"
                        sx={{
                          mt: 1,
                          px: 2,
                          py: 0.5,
                          borderRadius: "16px",
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                          border: "none",
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          letterSpacing: 0.5,
                          cursor: "pointer",
                          transition: "background 0.2s",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                          outline: "none",
                        }}
                        onClick={() => {
                          if (!user) {
                            showSnackbar(
                              "Para poder hacer la reservación primero tienes que iniciar sesión.",
                              "warning"
                            );
                          } else {
                            navigate(`/reservations/create/${h.id}`);
                          }
                        }}
                      >
                        {h.startTime}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Container>
  );
}
