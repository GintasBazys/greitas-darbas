import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Card, Col, Container, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import star from "../../assets/star.svg";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import offerProgress from "../../assets/offer_progress.svg";
import {db} from "../../firebase";
import {selectReservedRequest} from "../../features/requests/requestsSlice";
import RequestsChangeProgressModalComponent from "./RequestsChangeProgressModalComponent";
import history from "../../history";
import axios from "axios";
import moment from "moment";
import workInProgress from "../../assets/work_in_progress.svg";

const RequestPaidComponent = () => {
    const image = useSelector(selectImage);

    const [providerImage, setProviderImage] = useState("");
    const [docId, setDocId] = useState("");

    const reservedRequest = useSelector(selectReservedRequest);

    useEffect(() => {
        db.collection("users").doc(reservedRequest.user).get()
            .then((doc) => {
                setProviderImage(doc.data()?.image[0]);
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

    const cancelRequest = async () => {
        console.log(reservedRequest.title)
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("requests").where("title", "==", reservedRequest.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("requests").doc(doc.id).update({
                            status: "Atšaukta naudotojo"
                        })
                        await history.go(0);
                    })
                })

        }
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

                                <div style={{marginTop: "2rem"}}>
                                    <div>
                                        {
                                            reservedRequest.status !== "Atliktas" ?
                                                <div>
                                                    <div className="center-element">
                                                        <Button variant="outline-dark" onClick={handleProgressModalShow}>Keisti vykdymo būseną</Button>
                                                        <RequestsChangeProgressModalComponent show={progressModalShow} onHide={() => handleProgressModalShow()} title={reservedRequest.title} />
                                                        <Button style={{marginLeft: "2rem"}} variant="outline-dark">Peržiūrėti komentarus</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}} className="center-element">
                                                        <Button variant="outline-danger" onClick={cancelRequest}>Atšaukti užsakymą</Button>
                                                    </div>
                                                </div> : <div></div>
                                        }

                                    </div>
                                </div>
                        {
                            reservedRequest.status === "Atliktas" ?
                                <div className="alert alert-warning center-element" role="alert">
                                    <p>Laukite kol įvykdymas bus patvirtintas</p>
                                </div> : <div></div>
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
                            <UserSendMessageModalComponent user={reservedRequest.reservedUser} sender={reservedRequest.userMail} receiver={reservedRequest.reservedUserEmail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
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