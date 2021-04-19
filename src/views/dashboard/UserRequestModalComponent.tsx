import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {locations} from "./locations";
import {auth, db} from "../../firebase";
// @ts-ignore
import {v4 as uuid} from "uuid";
import history from "../../history";
import {useSelector} from "react-redux";
import {selectUserEmail} from "../../features/user/userSlice";
import {selectRequest} from "../../features/requests/requestsSlice";

interface Props {
    show: boolean,
    onHide: () => void,
}

const UserRequestModalComponent = (props: Props) => {

    const request = useSelector(selectRequest);

    const phoneNumber = request.phoneNumber;
    const title = request.title;
    const description = request.description;
    const budget = request.budget;
    const isRemote = request.isRemote;
    const location = request.location;
    const term = request.term;
    const address = request.address;
    const activity = request.activity;

    const userEmail = useSelector(selectUserEmail);

    const confirmRequestReservation = async () => {
        const confirm = window.confirm("Patvirtinti?");
        if (confirm) {
            let reservedUserName = "";
            let reservedUserPhone = "";
            await db.collection("users").doc(auth.currentUser?.uid).get()
                .then((doc) => {
                    reservedUserName = doc.data()?.nameAndSurname;
                    reservedUserPhone = doc.data()?.phoneNumber;
                })

            await db.collection("requests").where("title", "==", title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("requests").doc(doc.id).update({
                            status: "rezervuotas",
                            reservedUserNameAndSurname: reservedUserName,
                            reservedUserPhoneNumber: reservedUserPhone,
                            paymentStatus: "Mokėjimas neatliktas",
                            reservedUser: auth.currentUser?.uid
                        })
                        await history.go(0);
                    })
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
                    Peržiūrėti informaciją
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" disabled={true} placeholder="Įveskite paslaugos pavadinimą" value={title}/>
                    </Form.Group>
                    <Form.Group controlId="activity">
                        <label htmlFor="location">Veikla:</label>
                        <Form.Control type="text" disabled={true} name="activity" value={activity}>
                        </Form.Control>
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
                        <Form.Label>Terminas</Form.Label>
                        {/*@ts-ignore*/}
                        <Form.Control type="number" disabled={true} placeholder="Terminas" value={term}/>
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
                    <div className="center-element">
                        <Button variant="outline-dark" onClick={confirmRequestReservation}>Pateikti darbo užklausą</Button>
                    </div>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserRequestModalComponent;