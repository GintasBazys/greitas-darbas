import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {selectReservedOffer, setReservedOffer} from "../../features/offers/offersSlice";
import {db} from "../../firebase";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import star from "../../assets/star.svg";
import history from "../../history";
import ServiceProviderProgressModalComponent from "./ServiceProviderProgressModalComponent";
import offerProgress from "../../assets/offer_progress.svg";
import moment from "moment";
import store from "../../app/store";

const ServiceProviderOfferPaidComponent = () => {

    const image = useSelector(selectImage);
    const reservedOffer = useSelector(selectReservedOffer);

    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        db.collection("users").doc(reservedOffer.reservedUser).get()
            .then((doc) => {
                setUserImage(doc.data()?.image);
            })
    }, [])

    const [messageModalShow, setMessageModalShow] = useState(false);

    const handleMessageModalShow = () => {
        setMessageModalShow(!messageModalShow)
    }

    const confirmOfferCancel = async () => {
        console.log(reservedOffer.title)
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("reservedOffers").where("id", "==", reservedOffer.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Atšauktas teikėjo"
                        })
                        await history.go(0);
                    })
                })

        }
    }

    const [progressModalShow, setProgressModalShow] = useState(false);

    const handleProgressModalShow = (reservedOffer: any) => {
        store.dispatch(setReservedOffer(reservedOffer))
        setProgressModalShow(!progressModalShow)
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1 className="center-element">Užsakymas</h1>
                        <p className="center-element">Vietovė: {reservedOffer.location}, {reservedOffer.address}</p>
                        <div>
                            <p className="center-element">Aprašymas: {reservedOffer.description}</p>
                        </div>
                        <p className="center-element">Pavadinimas: {reservedOffer.title}</p>
                        <p className="center-element">Statusas: {reservedOffer.status}</p>

                        <p className="center-element">Kaina: {reservedOffer.price} €</p>

                        <p className="center-element">Pradžia: {moment(reservedOffer.reservedDay).format("YYYY-MM-DD")} {reservedOffer.reservedHour}</p>

                                <div>
                                    <div className="center-element">
                                        <Button variant="outline-dark" onClick={() => handleProgressModalShow(reservedOffer)}>Keisti vykdymo būseną</Button>
                                        <ServiceProviderProgressModalComponent show={progressModalShow} onHide={() => handleProgressModalShow(reservedOffer)} />

                                    </div>
                                    {
                                        reservedOffer.status === "Atliktas" ?
                                            <div>
                                                <Form.Group controlId="timeForOffer">
                                                    <Form.Label>Įveskite paslaugos trukmę valandomis</Form.Label>
                                                    <Form.Control type="text" placeholder="Įveskite paslaugos trukmę valandomis" value="10" />
                                                </Form.Group>
                                            </div> :
                                             <div>

                                             </div>
                                    }
                                    <div style={{marginTop: "2rem"}} className="center-element">
                                        <Button onClick={confirmOfferCancel} variant="outline-danger">Atšaukti užsakymą</Button>
                                        <Button style={{marginLeft: "2rem"}} variant="outline-dark">Peržiūrėti komentarus</Button>
                                    </div>
                                </div>
                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Paslaugos gavėjas</h1>
                        <div className="center-element">
                            <div style={{width: "80px", height: "80px", borderRadius: "50%", backgroundImage: `url(${userImage})`, backgroundSize: "cover", backgroundPosition: "center center"}}>

                            </div>
                        </div>

                        {/*@ts-ignore*/}
                        <p className="center-element"><Link to={{pathname: "/kitas",  query:{user: reservedOffer.reservedUser}}}>{reservedOffer.reservedUserEmail}</Link></p>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => handleMessageModalShow()}>Išsiųsti žinutę</Button>
                            <UserSendMessageModalComponent user={reservedOffer.reservedUser} receiver={reservedOffer.reservedUserEmail} sender={reservedOffer.userMail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="center-element">
                        <Image src={offerProgress} fluid />
                    </div>

                </Row>
            </Container>
        </div>
    )
}

export default ServiceProviderOfferPaidComponent;