import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {db} from "../../firebase";
import {Button, Form, Modal} from "react-bootstrap";
import * as firebase from "../../firebase";
import {selectUserEmail} from "../../features/user/userSlice";

interface Props {
    show: boolean,
    onHide: () => void,
    sender: string,
    receiver: string,
    user: string
}

const UserSendMessageModalComponent = (props: Props) => {
    const [message, setMessage] = useState("");

    const [id, setId] = useState("");

    console.log(props.sender)

    useEffect(() => {
        db.collection("users").where("email", "==", props.receiver).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    setId(doc.id);
                })
            })
    },[])

    const userEmail = useSelector(selectUserEmail);

    const handleMessageChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value)
    }
    //console.log(props.user)
    const sendMessage = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();

        const response = window.confirm("Išsiųsti žinutę?");
        console.log(props.sender + props.receiver + props.user);
        if (response) {
                let messages: any[] = [];
                let sentMessages: any[] = [];

                await firebase.usersCollection.doc(props.user).get()
                    .then((doc) => {
                        messages = doc.data()?.sentMessages;
                    });

                await firebase.usersCollection.doc(props.user).update({
                    sentMessages: [{receiver: props.sender, message: message, createdOn: new Date().toISOString()}, ...messages]
                })

                await firebase.usersCollection.doc(id).get()
                    .then((doc) => {
                        console.log(doc.data())
                        sentMessages = doc.data()?.receivedMessages;
                    });

                await firebase.usersCollection.doc(id).update({
                    receivedMessages: [{sender: props.receiver, message: message, createdOn: new Date().toISOString()}, ...sentMessages]
                })

            await props.onHide();
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

export default UserSendMessageModalComponent;