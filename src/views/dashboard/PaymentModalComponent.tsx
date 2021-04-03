import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import Stripe from "../../Stripe";
import {db} from "../../firebase";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const PaymentModalComponent = (props: Props) => {

    const sendPayment = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
    }

    const [connectedId, setConnectedId] = useState("");

    useEffect(() => {
        db.collection("users").where("email", "==", props.item.userMail).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setConnectedId(doc.data()?.connectedAccount)
                })
            }).catch((error) => {
                console.log(error.message)
        })
    }, [])

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={true}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Atlikti mokėjimą
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div style={{marginTop: "2rem"}}>
                        {props.item.title} - Mokėti {props.item.timeForOffer * props.item.price} eurų.
                    </div>
                    <div style={{marginTop: "2rem"}}>
                        <Stripe timeForOffer={props.item.timeForOffer} title={props.item.title} connectedId={connectedId} email={props.item.email} reservedUserEmail={props.item.reservedUserEmail} price={props.item.timeForOffer * props.item.price}/>
                    </div>

                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PaymentModalComponent;