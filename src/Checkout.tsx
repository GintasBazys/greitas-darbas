import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {Button, Form} from "react-bootstrap";
import axios from "axios";

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // @ts-ignore
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            // @ts-ignore
            card: elements.getElement(CardElement),
        });

        if (!error) {
            try {
                // @ts-ignore
                const {id} = paymentMethod;//TODO instead of id use username
                const response = await axios.post(
                    "http://localhost:8080/stripe/mokejimas",
                    {
                        amount: 100,
                        id: id,
                    }
                );

                if (response.data.success) {
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log(error.message);
        }
    }
    return <Form>
        <CardElement />
        <Button onClick={handleSubmit}>Moketi</Button>
    </Form>
}

export default Checkout;