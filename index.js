require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const pool = require(__dirname + "/config/db.config.js");

const app = express();

const PORT = process.env.PORT || 8000;

//
// Controllers/models
//
const getOfferings = (req, res) => {
    pool.query('SELECT * FROM offerings', (error, offerings) => {
        if (error) {
            throw error
        }
        res.status(200).json(offerings.rows)
    })
}

const createOffering = (req, res) => {
    const offeringData = req.body;
    const queryString = `INSERT INTO offerings (title, category, price, offeree) VALUES ('${offeringData.title}', '${offeringData.category}', ${offeringData.price}, '${offeringData.offeree}')`;
    pool.query(queryString, (error, newOffering) => {
            if (error) {
                throw error
            }
            res.send(newOffering)
        }
    )
}

const deleteOffering = (req, res) => {
    const offeringId = req.params.id;
    const queryString = `DELETE FROM offerings WHERE id=${offeringId}`;
    pool.query(queryString, (error, deletedOffering) => {
        if (error) {
            throw error
        }
        res.send(deletedOffering)
    })
}

app.use(cors());
app.use(express.json());

//
// Routes
//
app.get("/", (req, res) => {
    res.send("Hello world!");
})

app.get('/offerings', getOfferings)
app.post('/offerings', createOffering)
app.delete('/offerings/:id', deleteOffering)

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });