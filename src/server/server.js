// @ts-ignore
const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const admin = require("firebase-admin");

const serviceAccount = require("./greitas-darbas.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.post("/stripe/mokejimas", cors(), async (req, res) => {
    let { amount, id } = req.body;//taip pat reikia username
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "EUR",
            description: "Greitas Darbas Ltd",
            payment_method: id,
            confirm: true,
        });
        res.json({
            message: "Sekmingas mokejimas",
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: "Nesekmingas mokejimas",
            success: false,
        });
    }
});

app.post("/firebase/darbuotojai", cors(), async (req, res) => {
    let {uid} = req.body;
    //console.log(uid);
    try {
        await admin.auth().deleteUser(uid).then(() => {
            console.log("Istrynimas pavyko")
        })
        res.json({
            message: "Pavyko"
        })
    } catch (e) {
        
    }
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Serveris veikia");
});