require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const cors = require('cors');
const pool = require(__dirname + "/config/db.config.js");

const app = express();

const PORT = process.env.PORT || 8000;

//
// Controllers/models
//
const login = (req, res) => {
    const loginData = req.body;
    const queryString = `SELECT id, email, password FROM users WHERE email='${loginData.email}' AND password='${loginData.password}'`
    pool.query(queryString, (error, selection) => {
        if (error) {
            throw error
        }
        if (selection.rows.length == 1) {
            res.status(200).send({token: "userAuthenticated", id: selection.rows[0].id})
        } else if (selection.rows.length > 1) {
            res.status(500).send("This email-password pair references more than one user in our database...")
        } else {
            res.status(500).send("This email-password pair doesn't exist in our database.")
        }
    })
}

const getOffers = (req, res) => {
    pool.query('SELECT * FROM offers', (error, selection) => {
        if (error) {
            throw error
        }
        res.status(200).send(selection.rows)
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

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (error, selection) => {
        if (error) {
            throw error
        }
        res.status(200).json(selection.rows)
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

const createUser = (req, res) => {
    const userData = req.body;
    const queryString = `INSERT INTO users (email, password, name) VALUES ('${userData.email}', '${userData.password}', '${userData.name}')`;
    pool.query(queryString, (error, newUser) => {
        if (error) {
            throw error
        }
        res.send(newUser)
    })
}

app.use(cors());
app.use(express.json());

//
// Routes
//
app.post('/login', login)

app.get('/offers', getOffers)
app.get('/offerusers', getOffersWithUsers)
app.post('/offer', createOffer)
app.delete('/offer/:id', deleteOffer)

app.get('/users', getUsers)
app.get('/user/:id', getUser)
app.post('/user', createUser)

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});