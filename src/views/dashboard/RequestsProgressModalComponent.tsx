import React, {useEffect, useState} from "react";
// @ts-ignore
import StarRatingComponent from "react-star-rating-component";
import {Button, Modal} from "react-bootstrap";
import {db} from "../../firebase";

interface Props {
    show: boolean,
    onHide: () => void,
    title: string
}

const RequestsProgressModalComponent = (props: Props) => {

    const [rating, setRating] = useState(0);

    useEffect(() => {
        db.collection("requests").where("title", "==", props.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id)
                    db.collection("requestReview").doc(doc.id).get()
                        .then((document) => {
                            setRating(document.data()?.progressRating)
                        })
                })
            })
    }, [])

    const changeProgressRating = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

        event.preventDefault()

        db.collection("requests").where("title", "==", props.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("requestReview").doc(doc.id).update({
                        progressRating: rating
                    })
                })
            })
        props.onHide();
    }

    const handleStarClick = (nextValue: any) => setRating(nextValue);

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
                    Įvertinti progresą
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <StarRatingComponent
                    name="rate"
                    starCount={10}
                    value={rating}
                    onStarClick={(nextValue: any) => handleStarClick(nextValue)}
                    editing={true}
                />
                <Button variant="outline-dark" onClick={(event) => changeProgressRating(event)}>Patvirtinti</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{marginBottom: "15px", marginRight: "2rem"}} onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>

    )
}

export default RequestsProgressModalComponent;