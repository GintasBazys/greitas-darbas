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
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {auth, db} from "../../firebase";
import history from "../../history";
import {addOffer} from "../../features/offers/offersSlice";
import NotificationComponent from "../main_page/NotificationComponent";
import {usePagination} from "use-pagination-firestore";
import LoadingComponent from "../LoadingComponent";
import OffersUpdateModalComponent from "./OffersUpdateModalComponet";

const UserWorkOfferManagementComponent = () => {

    const image = useSelector(selectImage);
    const dispatch = useDispatch();
    const username = useSelector(selectUser);
    const userMail = useSelector(selectUserEmail);
    const error = useSelector(selectError);

    console.log(username)
    const [activityType, setActivityType] = useState("Veikla nenurodyta");
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showOffers, setShowOffers] = useState(false);
    const [title, setTitle] = useState("");

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

    const handleLocationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocation(event.target.value)
    }

    const handlePriceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrice(event.target.value)
    }

    const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        //TODO pavadinimas unikalus
        setTitle(event.target.value)
    }

    const submitOffer = async () => {
        //todo istestuoti laukus kad nepraleistu netinkamo formato

        if(description !== "" && phoneNumber !== "" && location !== "" && price !== "" && title !== "") {
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
                title: title
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
        //TODO padaryti kad title butu unikalus, sutvarkyti pagination
    }
    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}></Col>
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
                            <Form.Group controlId="location">
                                <Form.Label>Vietovė</Form.Label>
                                <Form.Control type="text" placeholder="Įveskite esamą darbo vietos adresą" value={location} onChange={handleLocationChange}/>
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Kaina</Form.Label>
                                <Form.Control type="text" placeholder="Įveskite paslaugos kainą naudojant valandinį tarifą" value={price} onChange={handlePriceChange}/>
                            </Form.Group>
                            <Form.Group controlId="time">
                                <Form.Label>Trukmė</Form.Label>
                                <Form.Control type="number" placeholder="Įveskite paslaugos trukmę valandomis" value={price} onChange={handlePriceChange}/>
                            </Form.Group>
                            <Form.Group controlId="availability">
                                <Form.Label>Pasiekiamumas</Form.Label>
                                <Form.Control type="text" placeholder="Pasiekiamumas savaitės dienomis" value={price} onChange={handlePriceChange}/>
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