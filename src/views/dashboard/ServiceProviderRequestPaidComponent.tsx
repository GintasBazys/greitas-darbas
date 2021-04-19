import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {db} from "../../firebase";
import history from "../../history";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import star from "../../assets/star.svg";

import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import offerProgress from "../../assets/offer_progress.svg";
import {selectReservedRequest} from "../../features/requests/requestsSlice";
import RequestsProgressModalComponent from "./RequestsProgressModalComponent";
import RequestsReviewModalComponent from "./RequestsReviewModalComponent";

import moment from "moment";
import RequestCompleteModalComponent from "./RequestCompleteModalComponent";
import CompletedRequestModalComponent from "./CompletedRequestModalComponent";

const ServiceProviderRequestPaidComponent = () => {
    const image = useSelector(selectImage);
    const reservedRequest = useSelector(selectReservedRequest);

    const [userImage, setUserImage] = useState("");

    useEffect(() => {
        db.collection("users").doc(reservedRequest.reservedUser).get()
            .then((doc) => {
                setUserImage(doc.data()?.image);
            })
    }, [])

    const [messageModalShow, setMessageModalShow] = useState(false);

    const handleMessageModalShow = () => {
        setMessageModalShow(!messageModalShow)
    }

    const cancelRequest = async () => {
        console.log(reservedRequest.title)
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("requests").where("title", "==", reservedRequest.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("requests").doc(doc.id).update({
                            status: "Atšauktas užsakovo"
                        })
                        await history.go(0);
                    })
                })

        }
    }

    const [progressModalShow, setProgressModalShow] = useState(false);

    const handleProgressModalShow = () => {
        setProgressModalShow(!progressModalShow)
    }

    const [reviewModalShow, setReviewModalShow] = useState(false);

    const handleReviewModalShow = () => {
        setReviewModalShow(!reviewModalShow)
    }

    const [completedModalShow, setCompletedModalShow] = useState(false);

    const handleCompletedRequestModalComponent = (reservedRequest: any) => {
        setCompletedModalShow(!completedModalShow);
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1 className="center-element">Darbas</h1>
                        <p className="center-element">Pavadinimas: {reservedRequest.title}</p>
                        <p className="center-element">Vietovė: {reservedRequest.location}, {reservedRequest.address}</p>
                        <p className="center-element">Telefono numeris: {reservedRequest.reservedUserPhoneNumber}</p>
                        <p className="center-element">El. paštas: {reservedRequest.reservedUserEmail}</p>
                        <p className="center-element">Aprašymas:</p>
                        <p >{reservedRequest.description}</p>
                        <p className="center-element">Terminas: {moment(reservedRequest.term).format("YYYY-MM-DD")}</p>
                        <p className="center-element">Statusas: {reservedRequest.status}</p>

                        <p className="center-element">Naudotojo vertinimas: {Math.round(reservedRequest.userRating)}<Image fluid src={star} /></p>
                        <p className="center-element">Biudžetas: {reservedRequest.budget} €</p>
                        {
                            reservedRequest.status !== "Atliktas" ?
                                <div>
                                    <div className="center-element">
                                        <Button onClick={() => handleProgressModalShow()} style={{marginRight: "2rem"}} variant="outline-dark">Keisti progreso vertinimą</Button>
                                        <RequestsProgressModalComponent title={reservedRequest.title} show={progressModalShow} onHide={() => handleProgressModalShow()} />
                                        <Button onClick={() => handleReviewModalShow()} variant="outline-dark">Palikti atsiliepimą</Button>
                                        <RequestsReviewModalComponent title={reservedRequest.title} show={reviewModalShow} onHide={() => handleReviewModalShow()} />
                                    </div>
                                    <div style={{marginTop: "2rem"}} className="center-element">
                                        <Button variant="outline-danger" onClick={cancelRequest}>Atšaukti užsakymą</Button>
                                    </div>
                                </div> : <div></div>
                        }
                        {
                            reservedRequest.status === "Atliktas" ?
                                <div>
                                    <div className="center-element">
                                        <Button variant="outline-dark" onClick={() => handleCompletedRequestModalComponent(reservedRequest)}>Atlikite mokėjimą</Button>
                                        <CompletedRequestModalComponent  show={completedModalShow} onHide={() => handleCompletedRequestModalComponent(reservedRequest)}  reservedRequest={reservedRequest}/>
                                    </div>
                                    <div className="center-element" style={{marginTop: "2rem"}}>
                                        <Button variant="outline-danger">Blogai atliktas darbas</Button>
                                    </div>
                                </div> : <div></div>
                        }
                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Darbuotojas</h1>
                        <div className="center-element">
                            <div style={{width: "80px", height: "80px", borderRadius: "50%", backgroundImage: `url(${userImage})`, backgroundSize: "cover", backgroundPosition: "center center"}}>

                            </div>
                        </div>

                        {/*@ts-ignore*/}
                        <p className="center-element"><Link to={{pathname: "/kitas",  query:{user: reservedRequest.reservedUser}}}>{reservedRequest.reservedUserEmail}</Link></p>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => handleMessageModalShow()}>Išsiųsti žinutę</Button>
                            <UserSendMessageModalComponent user={reservedRequest.user} receiver={reservedRequest.userMail} sender={reservedRequest.reservedUserEmail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
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

export default ServiceProviderRequestPaidComponent;