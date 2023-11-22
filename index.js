require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const pool = require(__dirname + "/config/db.config.js");

const app = express();

const PORT = process.env.PORT || 8000;

const getOfferings = (req, res) => {
    pool.query('SELECT * FROM offerings', (error, offerings) => {
        if (error) {
            throw error
        }
        res.status(200).json(offerings.rows)
    })
}

app.use(cors());
app.use(express.json());

// I'll need to set up:
// Routes
// Controllers
// Models
// Error handling?
app.get("/", (req, res) => {
    res.send("Hello world!");
})

app.get('/offerings', getOfferings)

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });