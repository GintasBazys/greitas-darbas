import React from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

import Checkout from "./Checkout";

const PUBLISHABLE_KEY = "pk_test_51IEDvEJIin4U4oiG7nA5nG8q8vNXkWor5XCqicDRYxsu9tEzigSyfSaN1ZNFI43LPTeFm0RrPKWtKjgSvRJxD7A100GiZiUULT";

const stripe = loadStripe(PUBLISHABLE_KEY);

interface Props {
    email: string,
    price: number,
    reservedUserEmail: string,
    connectedId: any,
    id: string,
}

const Stripe = (props: Props) => {
    return (
        <Elements stripe={stripe}>
        <Checkout id={props.id} connectedId={props.connectedId} email={props.email} reservedUserEmail={props.reservedUserEmail} price={props.price}/>
        </Elements>
    )
}

export default Stripe;