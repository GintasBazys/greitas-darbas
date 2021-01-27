import React from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

import Checkout from "./Checkout";

const PUBLISHABLE_KEY = "pk_test_51IEDvEJIin4U4oiG7nA5nG8q8vNXkWor5XCqicDRYxsu9tEzigSyfSaN1ZNFI43LPTeFm0RrPKWtKjgSvRJxD7A100GiZiUULT";

const stripe = loadStripe(PUBLISHABLE_KEY);

const Stripe = () => {
    return <Elements stripe={stripe}>
        <Checkout />
        </Elements>
}

export default Stripe;