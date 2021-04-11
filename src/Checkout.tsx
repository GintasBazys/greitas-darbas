import React, {useEffect, useState} from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import history from "./history";
import {db} from "./firebase";

interface Props {
    email: string,
    price: number,
    reservedUserEmail: string,
    connectedId: any,
    id: string,
}

const Checkout = (props: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const [docId, setId] = useState("");
    console.log(props.connectedId);

    useEffect(() => {
        db.collection("reservedOffers").where("id", "==", props.id).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setId(doc.id);
                })
            })
    })
    console.log(props.reservedUserEmail);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // @ts-ignore
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            // @ts-ignore
            card: elements.getElement(CardElement),
        });

        if (!error) {
            try {
                // @ts-ignore
                const {id} = paymentMethod;
                const response = await axios.post(
                    "http://localhost:8080/stripe/mokejimas",
                    {
                        amount: props.price,
                        id: id,
                        customer: props.reservedUserEmail,
                        connectedAccount: props.connectedId
                    }
                );

                if (response.data.success) {
                    console.log(response.data.success);
                    await db.collection("reservedOffers").doc(docId).update({
                        paymentStatus: "Mokėjimas atliktas",
                        status: "Mokėjimas atliktas",
                        paymentId: response.data.paymentId
                    })
                    await history.go(0);
                }
            } catch (error) {

                console.log(error.message);
                //history.go(0)
            }
        } else {
            console.log(error.message);
        }
    }

    return <Form>
        <CardElement />
        <Button style={{marginTop: "2rem"}} variant="outline-dark" onClick={handleSubmit}>Moketi</Button>
    </Form>
}

export default Checkout;