import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {db} from "../../firebase";

interface Props {
    reservedOffer: any,
    onHide: () => void,
    show: boolean
}

const CompletedOfferModalComponent = (props: Props) => {

    const [userRating, setUSerRating] = useState(0);

    useEffect(() => {
        db.collection("reservedOffers").where("id", "==", props.reservedOffer.id).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("offerReview").doc(doc.id).get()
                        .then((document) => {
                            setUSerRating(document.data()?.progressRating);
                        })
                })
            })
    }, [])

    const [docId, setDocId] = useState("");

    useEffect(() => {
        db.collection("users").doc(props.reservedOffer.user).get()
            .then((doc) => {
                setDocId(doc.id);
            })
    }, [])

    const completeOffer = async () => {

                await db.collection("reservedOffers").where("id", "==", props.reservedOffer.id).limit(1).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(async (doc) => {
                            await db.collection("reservedOffers").doc(doc.id).delete()
                            let progressRating = 0;

                            await db.collection("offerReview").doc(doc.id).get()
                                .then((doc) => {
                                    progressRating = doc.data()?.progressRating;
                                }).then(() => {
                                    db.collection("offerReview").doc(doc.id).delete()
                                })
                            let rating: number = 0;
                            await db.collection("users").doc(docId).get()
                                .then(async (doc) => {
                                    let ratingCount: number = doc.data()?.ratingCount + 1;
                                    let allRating: number = doc.data()?.allRating;
                                    rating = doc.data()?.rating;
                                    await db.collection("users").doc(docId).update({
                                        rating: (allRating + progressRating) / ratingCount,
                                        ratingCount: ratingCount,
                                        allRating: allRating + progressRating
                                    }).then(async () => {
                                        await db.collection("offers").where("user", "==", props.reservedOffer.user).get()
                                            .then((querySnapshot) => {
                                                querySnapshot.forEach((doc) => {
                                                    db.collection("offers").doc(doc.id).update({
                                                        userRating: (allRating + progressRating) / ratingCount,
                                                    })
                                                })
                                            })
                                        await history.go(0);
                                    })
                                })


                        })
                    })
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
                <p>Galutinis vertinimas: {userRating}</p>
                <Button variant="outline-dark" onClick={completeOffer}>Patvirtinti</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CompletedOfferModalComponent;