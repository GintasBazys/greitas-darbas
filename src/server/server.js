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
    headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`, "Access-Control-Allow-Origin": "*"
        },

};

let client = null;

// app.post("/stripe/mokejimas", cors(), async (req, resp) => {
//
//     let { amount, id, customer, connectedAccount } = req.body;
//         console.log(id);
//         console.log(customer)
//         try {
//              await axios.get(`https://api.stripe.com/v1/customers?email=${customer}`, config)
//                 .then((res) => {
//
//                     if(res.data.data.length === 0) {
//                         //console.log(id);
//                         console.log("nera userio")
//                         //console.log(id)
//
//                         const createClient = async () => {
//                             client = await stripe.customers.create({
//                                 email: customer,
//                             })
//                         }
//                         createClient().then(() => {
//                              stripe.paymentIntents.create({
//                                 amount: amount,
//                                  currency: "EUR",
//                                  description: "Greitas Darbas Ltd",
//                                  payment_method: id.id,
//                                  //customer: customer.id,
//                                  //requires_confirmation: false,
//                                  transfer_data: {
//                                      destination: connectedAccount
//                                  }
//
//                             }).catch((error)=> {
//                                 console.log(error.message)
//                              })
//                             resp.json({
//                                 paymentId: id,
//                                 message: "Sekmingas mokejimas",
//                                 success: true,
//                             });
//                         })
//
//
//
//                         } else {
//                                     console.log(res.data.data[0].id)
//
//                                     stripe.paymentIntents.create({
//                                         amount: amount,
//                                         currency: "EUR",
//                                         description: "Greitas Darbas Ltd",
//                                         payment_method: id.id,
//                                         //customer: res.data.data[0].id,
//                                         //requires_confirmation: false,
//                                         // transfer_data: {
//                                         //     destination: connectedAccount
//                                         // }
//                                     }).catch((error) => {
//                                         console.log(error.message);
//                                     })
//                         resp.json({
//                             paymentId: id,
//                             message: "Sekmingas mokejimas",
//                             success: true,
//                         });
//                     }
//
//                 }).catch(error => {
//                     console.log(error.message)
//                 })
//         } catch (e) {
//             console.log(e.message);
//         }
//
// });

app.post("/stripe/mokejimas", cors(), async (req, res) => {
    let { amount, id, customer, connectedAccount} = req.body;
    console.log(customer)
        await axios.get(`https://api.stripe.com/v1/customers?email=${customer}`, config)
                .then((resp) => {
                    console.log(resp.data.data)
                    if (resp.data.data.length === 0) {
                        //console.log(id);
                        console.log("nera userio")
                        //console.log(id)

                        let createClient = async () => {
                            client = await stripe.customers.create({
                                email: customer,
                            })
                        }
                        createClient().then(() => {
                             stripe.paymentIntents.create({
                                amount: amount,
                                 currency: "EUR",
                                 description: "Greitas Darbas Ltd",
                                 payment_method: id,
                                 confirm:true,
                                 customer: client.id,
                                 //requires_confirmation: false,
                                 transfer_data: {
                                     destination: connectedAccount
                                 }

                            }).catch((error)=> {
                                console.log(error.message)
                             })
                        })

                    }

                    else {
                        console.log(resp.data.data[0].id)

                         stripe.paymentIntents.create({
                            amount: amount,
                            currency: "EUR",
                            description: "Greitas Darbas Ltd",
                            payment_method: id,
                            customer: resp.data.data[0].id,
                            confirm:true,
                                        //requires_confirmation: false,
                            transfer_data: {
                                destination: connectedAccount
                            }
                        }).then((result) => {
                            res.json({
                                     paymentId: result.id,
                                     message: "Sekmingas mokejimas",
                                     success: true,
                            })
                         }).catch((error) => {
                                        console.log(error.message);
                        });

                    }

                })
});

app.post("/stripe/grazinimas", cors(), async (req, res) => {
    let {id} = req.body;
    const refund = await stripe.refunds.create({
        payment_intent: id,
    }).catch((error) => {
        console.log(error.message)
    })
})

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


app.post("/stripe/connected", cors(), async (req, res) => {

    let {customer } = req.body;

    const account = await stripe.accounts.create({
        type: "express",
        email: customer
    });
    console.log(account)
    const accountLinks = await stripe.accountLinks.create({
        account: `${account.id}`,
            currently_due: [],
            errors: [],
            past_due: [],
            pending_verification: [],
        refresh_url: 'http://localhost:3000/pagrindinis',
        return_url: 'http://localhost:3000/pagrindinis',
        type: 'account_onboarding',
    });

    await axios.get(`https://api.stripe.com/v1/customers?email=${customer}`, config)
        .then((res) => {

            if (res.data.data.length === 0) {
                console.log("nera userio")

                 stripe.customers.create({
                        email: customer,
                    })
                }
            })

    console.log(accountLinks);
    res.setHeader("Access-Control-Allow-Origin", "*")
    //res.send(accountLinks.url);
    res.send({id: account.id, link: accountLinks.url})
})

app.listen(process.env.PORT || 8080, () => {
    console.log("Serveris veikia");
});