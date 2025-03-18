const express = require('express');

const app = express();
app.use(express.json());

app.use('/auth', require('./routes/auth'));

// TODO update PORT management
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});