const cloudinary = require("cloudinary").v2;
const pool = require(__dirname + "/config/db.config.js");

exports.logIn = (req, res) => {
    const loginData = req.body;
    const queryString = `SELECT id, email, password FROM users WHERE email = '${loginData.email}' AND password = '${loginData.password}';`
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

exports.getOffers = (req, res) => {
    pool.query('SELECT * FROM offers;', (error, selection) => {
        if (error) {
            throw error
        }
        res.status(200).send(selection.rows)
    })
}

exports.getUserOffers = (req, res) => {
    const userId = req.params.id
    const queryString = `SELECT * FROM offers WHERE user_id = ${userId};`
    pool.query(queryString, (error, selection) => {
        if (error) {
            throw error
        }
        res.status(200).send(selection.rows)
    })
}

exports.getOffersWithUserIds = (req, res) => {
    const queryString = `SELECT id, user_id FROM offers;`
    pool.query(queryString, (error, selection) => {
        if (error) {
            throw error
        }
        res.send(selection.rows)
    })
}

exports.createOffer = (req, res) => {
    const offerData = req.body;
    const processedTitle = offerData.title.replaceAll("''", "'").replaceAll("'", "''");
    const processedDescription = offerData.description.replaceAll("''", "'").replaceAll("'", "''");
    console.log(processedDescription);
    const queryString = `INSERT INTO offers (title, category, price, description, user_id) VALUES ('${processedTitle}', '${offerData.category}', ${offerData.price}, '${processedDescription}', '${offerData.user_id}');`
    console.log(queryString);
    pool.query(queryString, (error, newOffer) => {
            if (error) {
                throw error
            }
            res.send(newOffer)
        }
    )
}

exports.deleteOffer = (req, res) => {
    const offerId = req.params.id;
    const queryString = `DELETE FROM offers WHERE id = ${offerId};`
    pool.query(queryString, (error, deletedOffer) => {
        if (error) {
            throw error
        }
        res.send(deletedOffer)
    })
}

exports.getUsers = (req, res) => {
    pool.query('SELECT * FROM users;', (error, selection) => {
        if (error) {
            throw error
        }
        res.status(200).json(selection.rows)
    })
}

exports.getUser = (req, res) => {
    const userId = req.params.id;
    const queryString = `SELECT * FROM users WHERE id = ${userId};`
    pool.query(queryString, (error, selection) => {
        if (error) {
            throw error
        }
        const user = selection.rows[0];
        res.send(user)
    })
}

exports.updateUser = (req, res, next) => {
    const userId = req.params.id;
    const userData = req.body;
    // Check to see which data need to be updated
    const incomingFields = ["name", "pronouns", "bio"]
    const incomingData = [userData.name, userData.pronouns, userData.bio]
    let dataString = ""
    for (let i = 0; i < 3; i++) {
        // Concatenate all the incoming data into a SQL-friendly string:
        // Replace accidental double apostrophes with single ones
        // Then, escape all the single apostrophes by replacing them with double ones
        // This ensures the string is SQL-friendly
        if (dataString == "" && incomingData[i] != "") {
            dataString = dataString + incomingFields[i] + " = '" + incomingData[i].replaceAll("''", "'").replaceAll("'", "''") + "'"
        } else if (dataString != "" && incomingData[i] != "") {
            dataString = dataString + ", " + incomingFields[i] + " = '" + incomingData[i].replaceAll("''", "'").replaceAll("'", "''") + "'"
        }
    }
    const queryString = `UPDATE users SET ${dataString} WHERE id = ${userId};`
    // console.log(queryString)
    pool.query(queryString, (error, updatedUser) => {
        if (error) {
            throw error
        }
        res.status(200).send(updatedUser)
    })  
}

exports.createUser = (req, res) => {
    const userData = req.body;
    const queryString = `INSERT INTO users (email, password, name) VALUES ('${userData.email}', '${userData.password}', '${userData.name}');`
    pool.query(queryString, (error, newUser) => {
        if (error) {
            throw error
        }
        res.send(newUser)
    })
}

// Cloudinary upload code
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

exports.uploadImage = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        res.json(cldRes);
    } catch (error) {
        console.log(error);
        res.send({
            message: error.message,
        });
    }
};

exports.setUserImage = (req, res) => {
    const userId = req.params.id
    const ppUrl = req.body.url
    const queryString = `UPDATE users SET photo_url = '${ppUrl}' WHERE id = ${userId}`
    // console.log(queryString)
    pool.query(queryString, (error, updatedUser) => {
        if (error) {
            throw error
        }
        res.status(200).send(updatedUser)
    })
}