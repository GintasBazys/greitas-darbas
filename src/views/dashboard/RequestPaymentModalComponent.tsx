import React, {useEffect, useState} from "react";
import {db} from "../../firebase";
import {Button, Form, Modal} from "react-bootstrap";
import Stripe from "../../Stripe";
import RequestStripe from "../../RequestStripe";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const RequestPaymentModalComponent = (props: Props) => {
    const [connectedId, setConnectedId] = useState("");

    useEffect(() => {
        db.collection("users").doc(props.item.reservedUser).get()//mokejimas bus pervestas i darbuotojo paskyra
            .then((doc) => {
                    setConnectedId(doc.data()?.connectedAccount)
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
                        {props.item.title} - Mokėti {props.item.budget} eurų.
                    </div>
                    <div style={{marginTop: "2rem"}}>
                        <RequestStripe title={props.item.title} connectedId={connectedId} email={props.item.email} reservedUserEmail={props.item.reservedUserEmail} budget={props.item.budget}/>
                    </div>

                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RequestPaymentModalComponent;