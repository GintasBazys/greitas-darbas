import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {locations} from "./locations";
import {db} from "../../firebase";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const UserRequestModalComponent = (props: Props) => {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [isRemote, setIsRemote] = useState(false);
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [docId, setDocId] = useState("");

    useEffect( () => {
        db.collection("requests").where("title", "==", props.item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setType(doc.data()?.type);
                    setDescription(doc.data()?.description);
                    setPhoneNumber(doc.data()?.phoneNumber);
                    setLocation(doc.data()?.location);
                    setBudget(doc.data()?.budget)
                    setTitle(doc.data()?.title);
                    setEstimatedTime(doc.data()?.estimatedTime);
                    setIsRemote(doc.data()?.isRemote);
                    setDocId(doc.id);
                })
            })
    }, [])

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
                    Peržiūrėti informaciją
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" disabled={true} placeholder="Įveskite paslaugos pavadinimą" value={title}/>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label>Tipas</Form.Label>
                        <Form.Control type="text" disabled={true} placeholder="Įveskite paslaugos tipą" value={type}/>
                    </Form.Group>
                    <Form.Group controlId="textarea" >
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control as="textarea" rows={3} disabled={true} placeholder="Aprašykite savo siūlomą paslaugą" value={description}/>
                    </Form.Group>
                    <Form.Group controlId="tel">
                        <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                        <Form.Control type="tel" disabled={true} value={phoneNumber}/>
                    </Form.Group>
                    <Form.Group controlId="budget">
                        <Form.Label>Biudžetas</Form.Label>
                        {/*@ts-ignore*/}
                        <Form.Control type="number" disabled={true} placeholder="Įveskite biudžeto sumą" value={budget}/>
                    </Form.Group>
                    <Form.Group controlId="time">
                        <Form.Label>Numatomas laikas</Form.Label>
                        {/*@ts-ignore*/}
                        <Form.Control type="number" disabled={true} placeholder="Įveskite numatomą atlikimo laiką" value={estimatedTime}/>
                    </Form.Group>
                    <Form.Group controlId="Select1">
                        <label htmlFor="location" style={{marginRight: "1rem"}}>Vietovė:</label>
                        <select name="location" disabled={true} value={location} required>
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="checkbox">
                        <Form.Check type="checkbox" label="Vykdymas nuotoliniu būdu?" disabled={true} checked={isRemote}/>
                    </Form.Group>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserRequestModalComponent;