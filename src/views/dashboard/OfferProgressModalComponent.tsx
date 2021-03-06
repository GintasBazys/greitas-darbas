import React, {useEffect, useState} from "react";
// @ts-ignore
import StarRatingComponent from "react-star-rating-component";
import {Button, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import {useSelector} from "react-redux";
import {selectReservedOffer} from "../../features/offers/offersSlice";

interface Props {
    show: boolean,
    onHide: () => void,
}

const OfferProgressModalComponent = (props: Props) => {

    const [rating, setRating] = useState(0);
    const reservedOffer = useSelector(selectReservedOffer);

    // const [ratingCount, setRatingCount] = useState(0);
    //
    useEffect(() => {
        db.collection("reservedOffers").where("id", "==", reservedOffer.id).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id)
                    db.collection("offerReview").doc(doc.id).get()
                        .then((document) => {
                            setRating(document.data()?.progressRating)
                        })
                })
            })
    }, [])

    const changeProgressRating = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

        event.preventDefault()

        db.collection("reservedOffers").where("id", "==", reservedOffer.id).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    db.collection("offerReview").doc(doc.id).update({
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
                    ??vertinti paslaug??
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
                <Button style={{marginBottom: "15px", marginRight: "2rem"}} onClick={props.onHide}>U??daryti</Button>
            </Modal.Footer>
        </Modal>

    )
}

export default OfferProgressModalComponent;