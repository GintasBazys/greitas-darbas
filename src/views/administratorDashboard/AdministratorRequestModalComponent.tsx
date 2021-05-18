import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {db} from "../../firebase";
import {Button, Form, Image, Modal} from "react-bootstrap";
import {locations} from "../dashboard/locations";
import {selectError} from "../../features/user/userSlice";
import ModalNotificationComponent from "../main_page/ModalNotificationComponent";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const AdministratorRequestModalComponent = (props: Props) => {
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [budget, setBudget] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");

    const dispatch = useDispatch();

    useEffect( () => {
        db.collection("requests").where("title", "==", props.item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setDescription(doc.data()?.description);
                    setPhoneNumber(doc.data()?.phoneNumber);
                    setLocation(doc.data()?.location);
                    setBudget(doc.data()?.budget)
                    setTitle(doc.data()?.title);
                    setIsRemote(doc.data()?.isRemote);
                    setType(doc.data()?.type);
                })
            })
    }, [])

    const errorMessage = useSelector(selectError);

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
                <ModalNotificationComponent message={errorMessage} />
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" placeholder="Įveskite paslaugos pavadinima" value={title} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label>Tipas</Form.Label>
                        <Form.Control type="text" disabled={true} placeholder="Įveskite paslaugos tipą" value={type}/>
                    </Form.Group>
                    <Form.Group controlId="textarea">
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Aprašykite savo siūlomą paslaugą" value={description} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="tel">
                        <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                        <Form.Control type="tel" value={phoneNumber} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="Select3">
                        <label htmlFor="location2" style={{marginRight: "1rem"}}>Vietovė:</label>
                        <select name="location2" value={location} disabled={true} >
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Biudžetas</Form.Label>
                        <Form.Control type="text" placeholder="Įveskite biudžeto sumą" disabled={true} value={budget}/>
                    </Form.Group>
                    <Form.Group controlId="checkbox">
                        <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu būdu?" disabled={true} checked={isRemote}/>
                    </Form.Group>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AdministratorRequestModalComponent;