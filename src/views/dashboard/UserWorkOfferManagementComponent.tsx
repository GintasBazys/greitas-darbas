import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectError,
    selectImage,
    selectUser,
    selectUserEmail,
    sendError
} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Form, Row, Image} from "react-bootstrap";
import {auth, db} from "../../firebase";
import history from "../../history";
import {addOffer} from "../../features/offers/offersSlice";
import NotificationComponent from "../main_page/NotificationComponent";
import {usePagination} from "use-pagination-firestore";
import LoadingComponent from "../LoadingComponent";
import OffersUpdateModalComponent from "./OffersUpdateModalComponent";
import {locations} from "./locations";
import {days} from "./days";
import {Link} from "react-router-dom";
import axios from "axios";

const UserWorkOfferManagementComponent = () => {

    const image = useSelector(selectImage);
    const dispatch = useDispatch();
    const username = useSelector(selectUser);
    const userMail = useSelector(selectUserEmail);
    const error = useSelector(selectError);

    const [activityType, setActivityType] = useState("Veikla nenurodyta");
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showOffers, setShowOffers] = useState(false);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [availability, setAvailability] = useState([]);

    useEffect( () => {
         db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setActivityType(doc.data()?.activityType);
                setUserRating(doc.data()?.rating);
            })
    }, [])

    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(event.target.value.length >= 101) {
            dispatch(sendError("Ne daugiau 500 simboliu"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setDescription(event.target.value)
        }

    }

    const handlePhoneNumberChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(isNaN(Number(event.target.value))) {
            dispatch(sendError("Iveskite tik skaičius"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setPhoneNumber(event.target.value)
        }

    }

    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }

    const handlePriceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrice(event.target.value)
    }

    const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        //TODO pavadinimas unikalus
        setTitle(event.target.value)
    }

    const handleTimeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTime(event.target.value)
    }

    const handleAvailabilityChange = (event: any) => {
        // @ts-ignore
        let value = Array.from(event.target.selectedOptions, option => option.value);
        // @ts-ignore
        setAvailability(value)
        console.log(value)
    }

    const submitOffer = async () => {
        //todo istestuoti laukus kad nepraleistu netinkamo formato

        if(title != "") {
            db.collection("offers").where("title", "==", title).limit(1).get()
                .then(() => {
                    dispatch(sendError("Skelbimas tokiu pavadinimu jau egzistuoja"))
                    setTimeout(() => {
                        dispatch(sendError(""))
                    }, 2000);
                }).catch((error) => {

            })
        }

        if(description !== "" && phoneNumber !== "" && price !== "" && title !== "") {
            await dispatch(addOffer({
                user: auth.currentUser?.uid,
                userMail: userMail,
                username: username,
                activityType: activityType,
                description: description,
                phoneNumber: phoneNumber,
                location: location,
                price: price,
                isRemote: isRemote,
                userRating: userRating,
                title: title,
                time: time,
                availability: availability
            }))

            await history.go(0);
        }
        else {
            dispatch(sendError("Nepalikite tuščių laukų"))
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }
    }

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("offers").orderBy("createdOn", "desc").where("username", "==", username), {
            limit: 10
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const updateOffer = (item: any) => {
        setModalShow(!modalShow)
    }
    const deleteOffer = (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if(response) {
            db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection("offers").doc(doc.id).delete()
                    })
                    //db.collection("users").doc()
                })
        }
    }

    const createConnectedAccount = () => {
        const confirm = window.confirm("Patvirtinti mokėjimo paskyros sukūrimą? Būsite nukreiptas į partnerių puslapį");
        if(confirm) {
            axios.post("http://localhost:8080/stripe/connected")
                .then((resp) => {
                    console.log(resp.data);
                    window.location.href=`${resp.data}`
                })
        }

    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <Button variant="outline-dark" style={{marginTop: "5rem"}} onClick={() => createConnectedAccount()}><span>Sukurti mokėjimų paskyrą</span></Button>
                        <Link to="/profilis"><h1 style={{marginTop: "10rem"}}>Profilis</h1><Image src={image} fluid alt="profilio nuotrauka"/></Link>
                    </Col>
                    <Col md={8}>
                        <NotificationComponent message={error} />
                        <Form>
                            <Form.Group>
                                <Form.Label>Veikla (pakeitimui susisiekti su klientų aptarnavimo specialistu)</Form.Label>
                                <Form.Control disabled={true} type="email" value={activityType}/>
                            </Form.Group>
                            <Form.Group controlId="title">
                                <Form.Label>Pavadinimas</Form.Label>
                                <Form.Control type="text" placeholder="Įveskite paslaugos pavadinima" value={title} onChange={handleTitleChange}/>
                            </Form.Group>
                            <Form.Group controlId="textarea">
                                <Form.Label>Aprašymas</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Aprašykite savo siūlomą paslaugą" value={description} onChange={handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select1">
                                <label htmlFor="location" style={{marginRight: "1rem"}}>Vietovė:</label>
                                <select name="location" value={location} onChange={handleLocationChange} required>
                                    {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Kaina</Form.Label>
                                <Form.Control type="text" placeholder="Įveskite paslaugos kainą naudojant valandinį tarifą" value={price} onChange={handlePriceChange}/>
                            </Form.Group>
                            <Form.Group controlId="time">
                                <Form.Label>Trukmė</Form.Label>
                                <Form.Control type="number" placeholder="Įveskite paslaugos trukmę valandomis" value={time} onChange={handleTimeChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select2">
                                <label htmlFor="availability" style={{marginRight: "1rem"}}>Vietovė:</label>
                                <select multiple={true} name="availability" value={availability} onChange={handleAvailabilityChange} required>
                                    {days.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="checkbox">
                                <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu būdu?" checked={isRemote}
                                            onChange={() => setIsRemote(!isRemote)}/>
                            </Form.Group>
                        </Form>
                        <div className="text-center">
                            <Button variant="outline-dark" onClick={() => submitOffer()}>Paskelbti</Button>
                        </div>
                        <div>
                            <Button style={{marginTop: "2rem"}} variant="outline-dark" onClick={() => setShowOffers(true)}>Peržiūrėti savo skelbimus</Button>
                            {
                                showOffers ?
                                    <div>
                                        {
                                             items.length === 0 ? <div></div> : isLoading? <LoadingComponent /> : items.map((item) => (
                                                <div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {item.title}
                                                        <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => updateOffer(item)}>Atnaujinti informaciją</Button>
                                                        <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteOffer(item)}>Pašalinti pasiūlymą</Button>
                                                    </div>

                                                    <OffersUpdateModalComponent show={modalShow} item={item} onHide={() => updateOffer(item)} />
                                                </div>
                                            ))
                                        }
                                        {
                                            items.length === 0 ? <div style={{marginTop: "2rem"}}>Daugiau skelbimų nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                                                <div className="center-element" style={{marginTop: "2rem"}}>
                                                <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                                                <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                                                </div>
                                        }
                                    </div>

                                 : <div></div>
                            }
                        </div>

                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserWorkOfferManagementComponent;