import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Card, Col, Container, Form, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {selectReservedOffer, setReservedOffer, setReservedTime} from "../../features/offers/offersSlice";
import {db} from "../../firebase";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import history from "../../history";
import ServiceProviderProgressModalComponent from "./ServiceProviderProgressModalComponent";
import offerProgress from "../../assets/offer_progress.svg";
import moment from "moment";
import store from "../../app/store";
import SubmitPaymentModalComponent from "./SubmitPaymentModalComponent";
import workInProgress from "../../assets/work_in_progress.svg";

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

    const [timeForOffer, setTimeForOffer] = useState(0);

    const handleTimeForOfferChange = (event: { target: { value: React.SetStateAction<number>; }; }) => {
        setTimeForOffer(event.target.value);
    }

    const [submitPaymentModalShow, setSubmitPaymentModalShow] = useState(false);

    const handleSubmitPaymentModalShow = async (reservedOffer: any) => {
        await store.dispatch(setReservedOffer(reservedOffer))
        await store.dispatch(setReservedTime(timeForOffer));
        await setSubmitPaymentModalShow(!submitPaymentModalShow)
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1 className="center-element">Užsakymas</h1>
                        <Card style={{ width: '30rem', marginLeft: "230px"}}>
                            <Card.Img variant="top" src={workInProgress} />
                            <Card.Body>
                                {/*@ts-ignore*/}
                                <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                    <Card.Title>{reservedOffer.title}</Card.Title>
                                </div>
                                <Card.Text>
                                    {/*@ts-ignore*/}
                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{reservedOffer.description}</div>
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Užsakovas: {reservedOffer.reservedUserNameAndSurname}</ListGroupItem>
                                <ListGroupItem>Vykdytojas: {reservedOffer.userMail}</ListGroupItem>
                                <ListGroupItem>Paslaugos vykdytojo nr. {reservedOffer.phoneNumber}</ListGroupItem>
                                <ListGroupItem>Paslaugos užsakovo nr. {reservedOffer.reservedUserPhoneNumber}</ListGroupItem>
                                <ListGroupItem>Miestas: {reservedOffer.location}</ListGroupItem>
                                <ListGroupItem>Adresas: {reservedOffer.address}</ListGroupItem>
                                <ListGroupItem>Pradžia: {moment(reservedOffer.reservedDay).format("YYYY-MM-DD")} {reservedOffer.reservedHour}</ListGroupItem>
                                <ListGroupItem>Valandinė kaina: {reservedOffer.price} €</ListGroupItem>
                                <ListGroupItem>Statusas: {reservedOffer.status}</ListGroupItem>
                            </ListGroup>
                        </Card>
                                <div style={{marginTop: "2rem"}}>
                                    <div className="center-element">
                                        <Button variant="outline-dark" onClick={() => handleProgressModalShow(reservedOffer)}>Keisti vykdymo būseną</Button>
                                        <ServiceProviderProgressModalComponent show={progressModalShow} onHide={() => handleProgressModalShow(reservedOffer)} />

                                    </div>
                                    {
                                        reservedOffer.status === "Atliktas" ?
                                            <div className="center-element">
                                                <Form.Group controlId="timeForOffer">
                                                    <Form.Label>Įveskite paslaugos trukmę valandomis</Form.Label>
                                                    {/*@ts-ignore*/}
                                                    <Form.Control type="number" placeholder="Įveskite paslaugos trukmę valandomis" value={timeForOffer} onChange={handleTimeForOfferChange} />
                                                    <Button style={{marginTop: "0.5rem"}} variant="outline-dark" onClick={() => handleSubmitPaymentModalShow(reservedOffer)}>Pateikti galutinę sumą</Button>
                                                    <SubmitPaymentModalComponent timeForOffer={timeForOffer} show={submitPaymentModalShow} onHide={() => handleSubmitPaymentModalShow(reservedOffer)} />
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