import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import history from "../../history";

interface Props {
    show: boolean,
    onHide: () => void,
    title: string
}

const ServiceProviderProgressModalComponent = (props: Props) => {

    const [progress, setProgress] = useState("");

    const handleProgressChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setProgress(event.target.value);
    }

    const changeProgress = async () => {
        await db.collection("offers").where("title", "==", props.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    await db.collection("offers").doc(doc.id).update({
                        status: progress,
                    })
                })
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
                    Keisti progreso statusą
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="Select">
                    <label htmlFor="progress" style={{marginRight: "1rem"}}>Progresas:</label>
                    <select value={progress} onChange={handleProgressChange} name="location2" required >
                        <option>Vykdomas</option>
                        <option>Atliktas</option>
                        <option>Atidėtas</option>
                    </select>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{marginBottom: "15px", marginRight: "2rem"}} onClick={() => {props.onHide(), changeProgress()}}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ServiceProviderProgressModalComponent;