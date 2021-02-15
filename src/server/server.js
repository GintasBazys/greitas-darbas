// @ts-ignore
const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());



app.post("/stripe/mokejimas", cors(), async (req, res) => {
    let { amount, id } = req.body;//also request user
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

app.listen(process.env.PORT || 8080, () => {
    console.log("Serveris veikia");
});