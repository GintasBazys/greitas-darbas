import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectError, selectImage, selectUserEmail} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import NotificationComponent from "../main_page/NotificationComponent";
import {auth, db} from "../../firebase";
import axios from "axios";

const UserSearchWorkerFormComponent = () => {

    const image = useSelector(selectImage);
    const error = useSelector(selectError);
    const userMail = useSelector(selectUserEmail);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [estimatedTime, setEstimatedTime] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");

    const [connectedId, setConnectedId] = useState(false);

    useEffect( () => {
        db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                if(doc.data()?.connectedAccount != "") {
                    setConnectedId(true);
                }
            })
    }, [])

    const createConnectedAccount = () => {
        const confirm = window.confirm("Patvirtinti mokėjimo paskyros sukūrimą? Būsite nukreiptas į partnerių puslapį");
        if (confirm) {
            axios.post("http://localhost:8080/stripe/connected", {
                customer: userMail
            })
                .then(async (resp) => {
                    console.log(resp.data);
                    await db.collection("users").doc(auth.currentUser?.uid).update({
                        connectedAccount: resp.data.id
                    })
                    window.location.href = `${resp.data.link}`;
                })
        }
    }
    const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        //TODO pavadinimas unikalus
        setTitle(event.target.value)
    }
    const handlePhoneNumberChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPhoneNumber(event.target.value)
    }
    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDescription(event.target.value)
    }
    const handleBudgetChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setBudget(event.target.value)
    }
    const handleEstimatedTimeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEstimatedTime(event.target.value)
    }
    const handleRemoteChange = (event: { target: { value: React.SetStateAction<boolean>; }; }) => {
        setIsRemote(event.target.value)
    }
    const handleLocationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocation(event.target.value)
    }
    const handleTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setType(event.target.value)
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <div style={{marginTop: "5rem"}}>
                            {
                                connectedId ?
                                    <div className="alert alert-success" role="alert" style={{marginTop: "2rem"}}>
                                        <p>Mokėjimo paskyra jau sukurta</p>
                                    </div> :

                                    <div>
                                        <Button disabled={connectedId} variant="outline-dark"  onClick={() => createConnectedAccount()}><span>Sukurti mokėjimų paskyrą</span></Button>
                                        <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                            <p>Paskyrą kurkite būtinai su el. paštu, kurį naudojote registracijos metu</p>
                                        </div>
                                    </div>
                            }


                        </div>

                        <Link to="/profilis"><h1 style={{marginTop: "10rem"}}>Profilis</h1><Image src={image} fluid alt="profilio nuotrauka"/></Link>
                    </Col>
                    <Col md={8}>
                        <NotificationComponent message={error} />

                        <Form style={{width:"75%"}}>
                            <Form.Group controlId="title">
                                <Form.Label>Pavadinimas</Form.Label>
                                <Form.Control type="text" disabled={!connectedId} placeholder="Įveskite paslaugos pavadinimą" value={title} onChange={handleTitleChange}/>
                            </Form.Group>
                            <div className="center-element">
                                <Button variant="outline-dark">Paskelbti</Button>
                            </div>

                        </Form>

                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserSearchWorkerFormComponent;