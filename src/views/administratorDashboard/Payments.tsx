import React from "react";
import LoadingComponent from "../LoadingComponent";
import {Button} from "react-bootstrap";

interface Props {
    items: any,
    loading: any
}


const Payments = ({items, loading}: Props) => {

    if(loading) {
        return <LoadingComponent />
    }

    return (
        <div>
            {// @ts-ignore
                items.map((payment) => {
                    return (
                        <div style={{display: "flex"}}>
                            <div>
                                {payment.receipt_email} Mokėta: {payment.amount/ 100} {payment.currency} - mokėjimo statusas: {payment.status}
                            </div>
                            <Button style={{marginLeft: "2rem"}} variant="outline-dark">Daugiau informacijos</Button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Payments;