import React from "react";
import LoadingComponent from "../LoadingComponent";
import {Button, Card} from "react-bootstrap";
import mail from "../../assets/mail.svg";
import money from "../../assets/money.svg";

interface Props {
    items: any,
    loading: any
}


const Payments = ({items, loading}: Props) => {

    if(loading) {
        return <LoadingComponent />
    }

    return (
        <div style={{display: "flex"}}>
            {// @ts-ignore
                items.map((payment) => {
                    return (
                        <div>
                            <div>
                                <Card style={{ width: '18rem', marginLeft: "5px"}}>
                                    <Card.Img variant="top" src={money} />
                                    <Card.Body>
                                        <Card.Title>Mokėta: {payment.amount/ 100} {payment.currency}</Card.Title>
                                        <Card.Text>
                                            mokėjimo statusas: {payment.status}
                                        </Card.Text>
                                        <Button variant="outline-dark">Daugiau informacijos</Button>
                                    </Card.Body>
                                </Card>
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default Payments;