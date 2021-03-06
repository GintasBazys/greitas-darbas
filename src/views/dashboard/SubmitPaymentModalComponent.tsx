import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectReservedOffer, selectReservedTime} from "../../features/offers/offersSlice";
import {db} from "../../firebase";
import history from "../../history";
import {Button, Form, Modal} from "react-bootstrap";

interface Props {
    show: boolean,
    onHide: () => void,
    timeForOffer: any
}

const SubmitPaymentModalComponent = (props: Props) => {

    const reservedOffer = useSelector(selectReservedOffer);
    const reservedTime = useSelector(selectReservedTime);

    const [fullPrice, setFullPrice] = useState(reservedOffer.price * reservedTime);

    const handlePriceChange = (event: any) => {
        setFullPrice(event.target.value)
    }

    const changeFullPrice = async () => {
        if (fullPrice === 0) {
            await db.collection("reservedOffers").where("id", "==", reservedOffer.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            fullPrice: reservedOffer.price * reservedTime,
                            status: "Laukiama mokėjimo"
                        })
                        await history.go(0);
                    })
                })
        } else {
            await db.collection("reservedOffers").where("id", "==", reservedOffer.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            fullPrice: fullPrice,
                            status: "Laukiama mokėjimo"
                        })
                        await history.go(0);
                    })
                })
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
                    Galutinė kaina
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div style={{marginTop: "2rem"}}>
                        Galutinė kaina: {props.timeForOffer * reservedOffer.price} eurų.
                        <Form.Group controlId="price">
                            <Form.Label>Keisti galutinę kainą</Form.Label>
                            {/*@ts-ignore*/}
                            <Form.Control type="number" value={fullPrice} onChange={handlePriceChange}/>
                        </Form.Group>
                    </div>
                    <Button variant="outline-dark" onClick={changeFullPrice}>Patvirtinti kainą</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{marginBottom: "15px", marginRight: "2rem"}}
                        onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SubmitPaymentModalComponent;