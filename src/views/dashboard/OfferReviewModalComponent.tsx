import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";

interface Props {
    show: boolean,
    onHide: () => void,
}

const OfferReviewModalComponent = (props: Props) => {

    const [comment, setComment] = useState("");

    const handleCommentChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setComment(event.target.value);
    }

    const sendComment = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault()
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
                    Palikti atsiliepimą
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="textarea">
                        <Form.Label>Komentaras</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Įveskite komentarą" value={comment} onChange={handleCommentChange}/>
                    </Form.Group>
                    <Button variant="outline-dark" onClick={(event) => sendComment(event)}>Parašyti komentarą</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{marginBottom: "15px", marginRight: "2rem"}} onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OfferReviewModalComponent;