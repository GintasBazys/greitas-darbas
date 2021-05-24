import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useSelector} from "react-redux";
import {auth} from "../../firebase";
import * as firebase from "../../firebase";
import {selectWorkerEmail} from "../../features/worker/workerSlice";

interface Props {
    show: boolean,
    onHide: () => void,
    user: string,
    username: string,
    email: string,
}

const AdministratorSendMessageModalComponent = (props: Props) => {

    const workerEmail = useSelector(selectWorkerEmail);

    const [message, setMessage] = useState("");

    const handleMessageChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value)
    }

    const sendMessage = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        const response = window.confirm("Išsiųsti žinutę?");
        if (response) {
            let messages: any[] = [];
            let sentMessages: any[] = [];

            await firebase.usersCollection.doc(props.user).get()
                .then((doc) => {
                    messages = doc.data()?.receivedMessages
                });

            await firebase.usersCollection.doc(props.user).update({
                receivedMessages: [`${message} - ${workerEmail}`, ...messages]
            })

            await firebase.usersCollection.doc(auth.currentUser?.uid).get()
                .then((doc) => {
                    sentMessages = doc.data()?.sentMessages
                });

            await firebase.usersCollection.doc(auth.currentUser?.uid).update({
                sentMessages: [`${message} - ${props.email}`, ...sentMessages]
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