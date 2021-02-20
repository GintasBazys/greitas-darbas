import React from "react";
import {Button, Modal} from "react-bootstrap";
import SignUp from "../../features/user/SignUp";

interface Props {
    show: boolean,
    onHide: () => void
}
const SignUpModalComponent = (props: Props) => {

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
                    Registracija
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SignUp />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignUpModalComponent;