import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import star from "../../assets/star.svg";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import offerProgress from "../../assets/offer_progress.svg";
import {db} from "../../firebase";
import {selectReservedRequest} from "../../features/requests/requestsSlice";
import RequestsChangeProgressModalComponent from "./RequestsChangeProgressModalComponent";

const RequestPaidComponent = () => {
    const image = useSelector(selectImage);

    const [providerImage, setProviderImage] = useState("");
    const [docId, setDocId] = useState("");

    const reservedRequest = useSelector(selectReservedRequest);

    useEffect(() => {
        db.collection("users").doc(reservedRequest.user).get()
            .then((doc) => {
                setProviderImage(doc.data()?.image);
                setDocId(doc.id);
            })
    }, [])

    const [messageModalShow, setMessageModalShow] = useState(false);

    const handleMessageModalShow = () => {
        setMessageModalShow(!messageModalShow)
    }

    const [progressModalShow, setProgressModalShow] = useState(false);

    const handleProgressModalShow = () => {
        setProgressModalShow(!progressModalShow)
    }

    //console.log(reservedRequest)

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1 className="center-element">Užsakymas</h1>
                        <p className="center-element">Vietovė: {reservedRequest.location}</p>
                        <div>
                            <p className="center-element">Aprašymas: {reservedRequest.description}</p>
                        </div>

                        <p className="center-element">Statusas: {reservedRequest.status}</p>

                        <p className="center-element">Naudotojo vertinimas: {Math.round(reservedRequest.userRating)}<Image fluid src={star} /></p>
                        <p className="center-element">Biudžetas: {reservedRequest.budget} €</p>

                        {
                            reservedRequest.status === "Mokėjimas atliktas" || reservedRequest.status === "Atidėta" || reservedRequest.status === "Vykdomas" ?
                                <div>
                                    <div>
                                        <div className="center-element">
                                            <Button variant="outline-dark" onClick={handleProgressModalShow}>Keisti vykdymo būseną</Button>
                                            <RequestsChangeProgressModalComponent show={progressModalShow} onHide={() => handleProgressModalShow()} title={reservedRequest.title} />

                                        </div>
                                        <div style={{marginTop: "2rem"}} className="center-element">
                                            <Button variant="outline-danger">Atšaukti užsakymą</Button>
                                            <Button style={{marginLeft: "2rem"}} variant="outline-dark">Peržiūrėti komentarus</Button>
                                        </div>
                                    </div>
                                </div> : <div></div>
                        }
                        {
                            reservedRequest.status === "Atšauktas naudotojo" ? <div className="alert alert-warning" role="alert">
                                <p className="center-element">Laukite kol paslaugos teikėjas patvirtins atšaukimą</p>
                            </div> : <div></div>
                        }
                        {
                            reservedRequest.status === "Atšaukimas patvirtintas" ?
                                <div className="center-element">
                                    {/*<Button onClick={() => initiateRefund(reservedOffer)} variant="outline-dark">Gražinti mokėjimą</Button>*/}
                                </div>: <div></div>
                        }
                        {
                            reservedRequest.status === "Atliktas" ?
                                <div className="center-element">
                                    {/*<Button variant="outline-dark" onClick={() =>transferPayment(reservedOffer)}>Patvirtinkite įvykdymą</Button>*/}
                                    {/*<CompletedOfferModalComponent show={completedModalShow} reservedOffer={reservedOffer} onHide={() => handleCompletedOfferModalComponent()} />*/}
                                </div> :<div></div>
                        }

                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Užsakovas</h1>
                        <div className="center-element">
                            <div style={{width: "80px", height: "80px", borderRadius: "50%", backgroundImage: `url(${providerImage})`, backgroundSize: "cover", backgroundPosition: "center center"}}>

                            </div>
                        </div>

                        {/*@ts-ignore*/}
                        <p className="center-element"><Link to={{pathname: "/kitas",  query:{user: reservedRequest.user}}}>{reservedRequest.username}</Link></p>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => handleMessageModalShow()}>Išsiųsti žinutę</Button>
                            <UserSendMessageModalComponent user={reservedRequest.user} sender={reservedRequest.reservedUserEmail} receiver={reservedRequest.userMail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
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

export default RequestPaidComponent;