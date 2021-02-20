import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {selectError, sendError} from "../../features/user/userSlice";
import NotificationComponent from "./NotificationComponent";
import {auth} from "../../firebase";

interface Props {
    show: boolean,
    onHide: () => void
}

const PasswordResetComponent = (props: Props) => {

    let errorMessage = useSelector(selectError);

    const [email, setEmail] = useState("");

    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    }

    const dispatch = useDispatch();

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        auth.sendPasswordResetEmail(email)
            .then(() => {
                dispatch(sendError("Patikrinkite paštą"))
                setTimeout(() => {
                    dispatch(sendError(""));
                }, 5000)
                setEmail("");
            }).catch((error) => {
            dispatch(sendError(error.message));
            setTimeout(() => {
                dispatch(sendError(""));
            }, 5000)
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
                    Pamiršote slaptažodį
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NotificationComponent message={errorMessage} />
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>El. pašto adresas</Form.Label>
                        <Form.Control type="text" value={email} autoComplete="on" placeholder="Įveskite el. pašto adresą" autoFocus onChange={handleEmailChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Siųsti
                    </Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PasswordResetComponent;
