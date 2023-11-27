require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const pool = require(__dirname + "/config/db.config.js");

const app = express();

const PORT = process.env.PORT || 8000;

//
// Controllers/models
//
const getOffers = (req, res) => {
    pool.query('SELECT * FROM offers', (error, selection) => {
        if (error) {
            throw error
        }
        res.status(200).json(selection.rows)
    })
}

const getOffersWithUsers = (req, res) => {
    const queryString = `SELECT id, user_id FROM offers`;
    pool.query(queryString, (error, selection) => {
        if (error) {
            throw error
        }
        res.send(selection.rows)
    })
}

const createOffer = (req, res) => {
    const offerData = req.body;
    const queryString = `INSERT INTO offers (title, category, price, user_id) VALUES ('${offerData.title}', '${offerData.category}', ${offerData.price}, '${offerData.user_id}')`;
    pool.query(queryString, (error, newOffer) => {
            if (error) {
                throw error
            }
            res.send(newOffer)
        }
    )
}

const deleteOffer = (req, res) => {
    const offerId = req.params.id;
    const queryString = `DELETE FROM offers WHERE id=${offerId}`;
    pool.query(queryString, (error, deletedOffer) => {
        if (error) {
            throw error
        }
        res.send(deletedOffer)
    })
}

const getUser = (req, res) => {
    const userId = req.params.id;
    const queryString = `SELECT * FROM users WHERE id=${userId}`;
    pool.query(queryString, (error, selection) => {
        if (error) {
            throw error
        }
        const user = selection.rows[0];
        res.send(user)
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

app.get('/offers', getOffers)
app.get('/offerusers', getOffersWithUsers)
app.post('/offers', createOffer)
app.delete('/offers/:id', deleteOffer)

app.get('/user/:id', getUser)

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});