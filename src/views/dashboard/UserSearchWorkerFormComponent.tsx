import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectError, selectImage, selectUser, selectUserEmail} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import NotificationComponent from "../main_page/NotificationComponent";
import {auth, db} from "../../firebase";
import axios from "axios";
import {locations} from "./locations";
import {addRequest} from "../../features/requests/requestsSlice";
import history from "../../history";
import {activities} from "./registration/activities";
import DatePicker from "react-datepicker";

const UserSearchWorkerFormComponent = () => {

    const image = useSelector(selectImage);
    const error = useSelector(selectError);
    const userMail = useSelector(selectUserEmail);
    const dispatch = useDispatch();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [isRemote, setIsRemote] = useState(false);
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const username = useSelector(selectUser);
    const [userRating, setUserRating] = useState(0);
    const [profileImage, setProfileImage] = useState("");

    const [connectedId, setConnectedId] = useState(false);
    const [nameAndSurname, setNameAndSurname] = useState("");

    useEffect( () => {
        db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setUserRating(doc.data()?.rating);
                setProfileImage(doc.data()?.image[0]);
                setNameAndSurname(doc.data()?.nameAndSurname);
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
    const handleBudgetChange = (event: { target: { value: React.SetStateAction<number>; }; }) => {
        setBudget(event.target.value)
    }
    const handleEstimatedTimeChange = (event: { target: { value: React.SetStateAction<number>; }; }) => {
        setEstimatedTime(event.target.value)
    }

    const handleLocationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocation(event.target.value)
    }
    const handleTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setType(event.target.value)
    }

    const createRequest = async () => {
        await dispatch(addRequest({
            user: auth.currentUser?.uid,
            username: username,
            userMail: userMail,
            title: title,
            description: description,
            phoneNumber: phoneNumber,
            budget: budget,
            isRemote: isRemote,
            location: location,
            activity: type,
            userRating: userRating,
            profileImage: profileImage,
            term: reservedTimeDay.toISOString(),
            nameAndSurname: nameAndSurname,
            address: address,
            reservedUserNameAndSurname: "",
            reservedUserPhoneNumber: "",
            paymentStatus: "",
            reservedUser: "",
            reservedUserEmail: ""
        }));
        await history.go(0);

    }
    const [reservedTimeDay, setReservedTimeDay] = useState(new Date());
    const [address, setAddress] = useState("");

    const handleAddressChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setAddress(event.target.value)
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
                            <Form.Group controlId="activity">
                                <label htmlFor="location">Veikla:</label>
                                <select name="activity" value={type} onChange={handleTypeChange} required>
                                    {activities.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="textarea" >
                                <Form.Label>Aprašymas</Form.Label>
                                <Form.Control as="textarea" rows={3} disabled={!connectedId} placeholder="Aprašykite savo siūlomą darbą" value={description} onChange={handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="tel" disabled={!connectedId} value={phoneNumber} onChange={handlePhoneNumberChange}/>
                            </Form.Group>
                            <Form.Group controlId="budget">
                                <Form.Label>Biudžetas</Form.Label>
                                {/*@ts-ignore*/}
                                <Form.Control type="number" disabled={!connectedId} placeholder="Įveskite biudžeto sumą" value={budget} onChange={handleBudgetChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select1">
                                <label htmlFor="location" style={{marginRight: "1rem"}}>Vietovė:</label>
                                <select name="location" disabled={!connectedId} value={location} onChange={handleLocationChange} required>
                                    {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="checkbox">
                                <Form.Check type="checkbox" label="Vykdymas nuotoliniu būdu?" disabled={!connectedId} checked={isRemote}
                                            onChange={() => setIsRemote(!isRemote)}/>
                            </Form.Group>
                            <Form.Group>

                                <label htmlFor="location" style={{marginRight: "1rem"}}>Terminas:</label>
                                {/*@ts-ignore*/}
                                <DatePicker locale="lt" selected={reservedTimeDay} onChange={(date):any => setReservedTimeDay(date)} />
                            </Form.Group>
                            <Form.Group controlId="address">
                                <Form.Label>Adresas</Form.Label>
                                <Form.Control type="text" disabled={!connectedId} placeholder="Įveskite tikslų adresą" value={address} onChange={handleAddressChange}/>
                            </Form.Group>
                            <div className="center-element">
                                <Button variant="outline-dark" onClick={createRequest}>Paskelbti</Button>
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