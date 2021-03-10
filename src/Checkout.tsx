import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {selectWorkerEmail} from "./features/worker/workerSlice";
import {useSelector} from "react-redux";
import {selectUserEmail} from "./features/user/userSlice";
import history from "./history";

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const userMail = useSelector(selectUserEmail);

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
                        amount: 100,//TODO props
                        id: id,
                        customer: userMail
                    }
                );

                if (response.data.success) {
                    history.go(0);
                }
            } catch (error) {
                history.go(0)
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