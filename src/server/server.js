// @ts-ignore
const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const admin = require("firebase-admin");

const serviceAccount = require("./greitas-darbas.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const config = {
    headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}` },

};

let client = null;

const createClient = async (customer) => {
    client = await stripe.customers.create({
        email: customer,
    })
}

app.post("/stripe/mokejimas", cors(), async (req, res) => {

    let { amount, id, customer } = req.body;

        try {
             await axios.get(`https://api.stripe.com/v1/customers?email=dfds`, config)
                .then((res) => {

                    if(res.data.data.length === 0) {
                        console.log("nera userio")

                            const test = async () => {
                                const createdClient = await createClient(customer);
                                console.log(createdClient)
                            }

                            test()

                            // const payment = stripe.paymentIntents.create({
                            //     amount: amount,
                            //     currency: "EUR",
                            //     description: "Greitas Darbas Ltd",
                            //     payment_method: id,
                            //     confirm: true,
                            //     customer: client[0].id
                            //
                            // });

                        } else {
                                    console.log(res.data.data[0].id)

                                    const payment = stripe.paymentIntents.create({
                                        amount: amount,
                                        currency: "EUR",
                                        description: "Greitas Darbas Ltd",
                                        payment_method: id,
                                        confirm: true,
                                        customer: res.data.data[0].id

                                    });
                    }

                }).catch(error => {
                    console.log(error.message)
                })
        } catch (e) {
            console.log(e.message);
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

app.post("/firebase/naudotojai", cors(), async (req, res) => {
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