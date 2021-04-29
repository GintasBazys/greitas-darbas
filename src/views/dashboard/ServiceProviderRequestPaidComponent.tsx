import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {db} from "../../firebase";
import history from "../../history";
import {Button, Card, Col, Container, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";
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
import workInProgress from "../../assets/work_in_progress.svg";

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
                            status: "Atšaukta teikėjo"
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
                        <Card style={{ width: '30rem', marginLeft: "230px"}}>
                            <Card.Img variant="top" src={workInProgress} />
                            <Card.Body>
                                {/*@ts-ignore*/}
                                <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                    <Card.Title>{reservedRequest.title}</Card.Title>
                                </div>
                                <Card.Text>
                                    {/*@ts-ignore*/}
                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{reservedRequest.description}</div>
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Užsakovas: {reservedRequest.userMail}</ListGroupItem>
                                <ListGroupItem>Vykdytojas: {reservedRequest.reservedUserNameAndSurname}</ListGroupItem>
                                <ListGroupItem>Darbuotojo nr. {reservedRequest.reservedUserPhoneNumber}</ListGroupItem>
                                <ListGroupItem>Užsakovo nr. {reservedRequest.phoneNumber}</ListGroupItem>
                                <ListGroupItem>Miestas: {reservedRequest.location}</ListGroupItem>
                                <ListGroupItem>Adresas: {reservedRequest.address}</ListGroupItem>
                                <ListGroupItem>Terminas: {moment(reservedRequest.term).format("YYYY-MM-DD")}</ListGroupItem>
                                <ListGroupItem>Biudžetas: {reservedRequest.budget} €</ListGroupItem>
                                <ListGroupItem>Statusas: {reservedRequest.status}</ListGroupItem>
                                <ListGroupItem>Naudotojo vertinimas: {Math.round(reservedRequest.userRating)}</ListGroupItem>
                            </ListGroup>
                        </Card>
                        {
                            reservedRequest.status !== "Atliktas" ?
                                <div style={{marginTop: "2rem"}}>
                                    <div className="center-element">
                                        <Button onClick={() => handleProgressModalShow()} style={{marginRight: "2rem"}} variant="outline-dark">Keisti paslaugos vertinimą</Button>
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
                                <div style={{marginTop: "2rem"}}>
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