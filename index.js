require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});