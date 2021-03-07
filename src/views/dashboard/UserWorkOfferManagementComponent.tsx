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

    useEffect( () => {
         db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setActivityType(doc.data()?.activityType);
                setUserRating(doc.data()?.rating);
            })
    }, [])

    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDescription(event.target.value)
    }

    const handlePhoneNumberChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPhoneNumber(event.target.value)
    }

    const handleLocationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocation(event.target.value)
    }

    const handlePriceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrice(event.target.value)
    }

    const submitOffer = async () => {
        //todo istestuoti laukus kad nepraleistu netinkamo formato

        if(description !== "" && phoneNumber !== "" && location !== "" && price !== "") {
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
                userRating: userRating
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
                            <Form.Group controlId="textarea">
                                <Form.Label>Aprašymas</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Aprašykite savo siūlomą paslaugą" value={description} onChange={handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label>Telefono nr.</Form.Label>
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
                            <Form.Group controlId="checkbox">
                                <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu būdu?" checked={isRemote}
                                            onChange={() => setIsRemote(!isRemote)}/>
                            </Form.Group>
                        </Form>
                        <div className="text-center">
                            <Button variant="outline-dark" onClick={() => submitOffer()}>Paskelbti</Button>
                        </div>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserWorkOfferManagementComponent;