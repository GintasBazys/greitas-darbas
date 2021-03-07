import React from "react";
import {Button, Form, Modal} from "react-bootstrap";

interface Props {
    show: boolean,
    onHide: () => void,
}

const OffersUpdateModalComponent = (props: Props) => {
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
                    Atnaujinti informaciją
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Button variant="primary" type="submit">
                        Patvirtinti pakeitimus
                    </Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OffersUpdateModalComponent;