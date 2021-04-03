import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import axios from "axios";

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
        db.collection("requestReview").doc()
    }, [])

    const [docId, setDocId] = useState("");
    const [connectedAccount, setConnectedAccount] = useState(0);

    useEffect(() => {
        db.collection("users").doc(props.reservedRequest.reservedUser).get()
            .then((doc) => {
                setDocId(doc.id);
                setConnectedAccount(doc.data()?.connectedAccount)
            })
    }, [])

    const transferPayment = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/stripe/darbas/pervedimas",
                {
                    connectedAccount: connectedAccount,
                    amount: props.reservedRequest.budget * 100,
                }
            );
            console.log(response.data.success);
            if (response.data.success) {
                await db.collection("requests").where("title", "==", props.reservedRequest.title).limit(1).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(async (doc) => {

                            await db.collection("requestReview").doc(doc.id).get()
                                .then((doc) => {
                                    progressRating = doc.data()?.progressRating;
                                }).then(() => {
                                    db.collection("requestReview").doc(doc.id).delete()
                                })

                            await db.collection("requests").doc(doc.id).delete()
                            let progressRating = 0;

                            let rating: number = 0;
                            await db.collection("users").doc(docId).get()
                                .then((doc) => {
                                    let ratingCount: number = doc.data()?.ratingCount + 1;
                                    rating = doc.data()?.rating;
                                    db.collection("users").doc(docId).update({
                                        rating: rating + progressRating / ratingCount,
                                        ratingCount: ratingCount
                                    }).then(() => {
                                        db.collection("requests").doc(doc.id).update({
                                            userRating: rating + progressRating / ratingCount,
                                        })
                                    })
                                })

                            await history.go(0);
                        })
                    })
                //
            }

        } catch (e) {

        }
    }

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
                <p>Galutinis progreso vertinimas: {userRating}</p>
                <Button variant="outline-dark" onClick={transferPayment}>Patvirtinti</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CompletedRequestModalComponent;