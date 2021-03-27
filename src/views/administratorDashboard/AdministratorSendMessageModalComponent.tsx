import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {createMessage} from "../../features/messages/messagesSlice";
import {auth} from "../../firebase";

interface Props {
    show: boolean,
    onHide: () => void,
    user: string,
    username: string,
    email: string,
}

const AdministratorSendMessageModalComponent = (props: Props) => {

    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    const handleMessageChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value)
    }

    const sendMessage = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        const response = window.confirm("Išsiųsti žinutę?");
        if (response) {
            await dispatch(createMessage({
                email: props.email,
                username: props.username,
                user: props.user,
                message: message,
                sender: auth.currentUser?.uid
            }))
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
                    Siųsti žinutę
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="textarea">
                        <Form.Label>Žinutė</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Įveskite žinutę" value={message} onChange={handleMessageChange}/>
                    </Form.Group>
                    <Button variant="outline-dark" onClick={(event) => sendMessage(event)}>Parašyti žinutę</Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AdministratorSendMessageModalComponent;