const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use("/auth", require("./routes/auth"));
app.use("/rooms", require("./routes/room"));
app.use('/movies', require('./routes/movie'));
app.use('/schedules', require('./routes/schedule'));
app.use('/movie-genres', require('./routes/movieGenre'));
app.use('/reservations', require('./routes/reservations'));

app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
