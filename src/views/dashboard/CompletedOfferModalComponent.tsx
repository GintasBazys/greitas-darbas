import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import axios from "axios";

interface Props {
    reservedOffer: any,
    onHide: () => void,
    show: boolean
}

const CompletedOfferModalComponent = (props: Props) => {

    const [userRating, setUSerRating] = useState(0);

    useEffect(() => {
        db.collection("offers").where("title", "==", props.reservedOffer.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("offerReview").doc(doc.id).get()
                        .then((document) => {
                            setUSerRating(document.data()?.progressRating);
                        })
                })
            })
        db.collection("offerReview").doc()
    }, [])

    const [docId, setDocId] = useState("");
    const [connectedAccount, setConnectedAccount] = useState(0);

    useEffect(() => {
        db.collection("users").doc(props.reservedOffer.user).get()
            .then((doc) => {
                setDocId(doc.id);
                setConnectedAccount(doc.data()?.connectedAccount)
            })
    }, [])

    const transferPayment = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/stripe/pervedimas",
                {
                    connectedAccount: connectedAccount,
                    amount: props.reservedOffer.price * props.reservedOffer.timeForOffer * 100,
                }
            );
            console.log(response.data.success);
            if (response.data.success) {
                await db.collection("offers").where("title", "==", props.reservedOffer.title).limit(1).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(async (doc) => {
                            await db.collection("offers").doc(doc.id).update({
                                status: "naujas",
                                reservedTimeDay: "",
                                reservedTimeHour: "",
                                reservedUser: "",
                                reservedUserEmail: "",
                                paymentId: "",
                                paymentStatus: "",
                                timeForOffer: ""
                            })
                            let progressRating = 0;

                            await db.collection("offerReview").doc(doc.id).get()
                                .then((doc) => {
                                    progressRating = doc.data()?.progressRating;
                                }).then(() => {
                                    db.collection("offerReview").doc(doc.id).delete()
                                })
                            let rating: number = 0;
                            await db.collection("users").doc(docId).get()
                                .then((doc) => {
                                    let ratingCount: number = doc.data()?.ratingCount + 1;
                                    rating = doc.data()?.rating;
                                    db.collection("users").doc(docId).update({
                                        rating: rating + progressRating / ratingCount,
                                        ratingCount: ratingCount
                                    }).then(() => {
                                        db.collection("offers").doc(doc.id).update({
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

export default CompletedOfferModalComponent;