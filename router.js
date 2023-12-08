const express = require('express');
const controller = require('./controller');
const Multer = require("multer");

const app = express();

app.get('/test', (req, res) => {
  res.json({ message: "Hello from the server!" });
})

app.post('/login', controller.logIn)

app.get('/offers', controller.getOffers)
app.get('/offers/:id', controller.getUserOffers)
app.get('/offeruserpairs', controller.getOffersWithUserIds)
app.post('/offer', controller.createOffer)
app.delete('/offer/:id', controller.deleteOffer)

app.get('/users', controller.getUsers)
app.get('/user/:id', controller.getUser)
app.patch('/user/:id', controller.updateUser)
app.post('/user', controller.createUser)

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

app.post('/image', upload.single("my_file"), controller.uploadImage)
app.patch('/image/:id', controller.setUserImage)

module.exports = app;