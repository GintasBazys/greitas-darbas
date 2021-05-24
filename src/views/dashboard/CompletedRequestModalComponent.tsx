import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import RequestStripe from "../../RequestStripe";

interface Props {
    reservedRequest: any,
    onHide: () => void,
    show: boolean
}

const CompletedRequestModalComponent = (props: Props) => {

    const [userRating, setUSerRating] = useState(0);

    useEffect(() => {
        db.collection("requests").where("title", "==", props.reservedRequest.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("requestReview").doc(doc.id).get()
                        .then((document) => {
                            setUSerRating(document.data()?.progressRating);
                        })
                })
            })
    }, [])

    const [connectedAccount, setConnectedAccount] = useState(0);

    useEffect(() => {
        db.collection("users").doc(props.reservedRequest.reservedUser).get()
            .then((doc) => {
                setConnectedAccount(doc.data()?.connectedAccount)
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
                    Patvirtinti įvykdymą
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Galutinis vertinimas: {userRating}</p>
                <p>Mokėtina suma: {props.reservedRequest.budget}€</p>
                <RequestStripe connectedId={connectedAccount} userMail={props.reservedRequest.userMail} reservedUserEmail={props.reservedRequest.reservedUserEmail} budget={props.reservedRequest.budget} title={props.reservedRequest.title}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CompletedRequestModalComponent;