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
                        {props.item.title} - Mokėti {props.item.fullPrice} eurų.
                    </div>
                    <div style={{marginTop: "2rem"}}>
                        <Stripe id={props.item.id} connectedId={connectedId} email={props.item.email} reservedUserEmail={props.item.reservedUserEmail} price={props.item.fullPrice}/>
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