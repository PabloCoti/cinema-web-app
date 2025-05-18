const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

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

const PORT = process.env.API_PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
