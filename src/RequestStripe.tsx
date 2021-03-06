import React from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

import RequestCheckout from "./RequestCkeckout";

const PUBLISHABLE_KEY = "pk_test_51IEDvEJIin4U4oiG7nA5nG8q8vNXkWor5XCqicDRYxsu9tEzigSyfSaN1ZNFI43LPTeFm0RrPKWtKjgSvRJxD7A100GiZiUULT";

const stripe = loadStripe(PUBLISHABLE_KEY);

interface Props {
    userMail: string,
    budget: number,
    reservedUserEmail: string,
    connectedId: any,
    title: string
}

const RequestStripe = (props: Props) => {
    return (
        <Elements stripe={stripe}>
            <RequestCheckout title={props.title} connectedId={props.connectedId} email={props.userMail} reservedUserEmail={props.reservedUserEmail} budget={props.budget}/>
        </Elements>
    )
}

export default RequestStripe;