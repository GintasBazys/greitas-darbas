import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {selectReservedOffer} from "../../features/offers/offersSlice";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import star from "../../assets/star.svg";
import {db} from "../../firebase";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import OfferProgressModalComponent from "./OfferProgressModalComponent";
import OfferReviewModalComponent from "./OfferReviewModalComponent";

const OfferPaidComponent = () => {

    const image = useSelector(selectImage)

    const reservedOffer = useSelector(selectReservedOffer)
    const [providerImage, setProviderImage] = useState("");

    useEffect(() => {
        db.collection("users").doc(reservedOffer.user).get()
            .then((doc) => {
                setProviderImage(doc.data()?.image);
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

    const [reviewModalShow, setReviewModalShow] = useState(false);

    const handleReviewModalShow = () => {
        setReviewModalShow(!reviewModalShow)
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <h1 className="center-element">Užsakymas</h1>
                        <p className="center-element">Vietovė: {reservedOffer.location}</p>
                        <div>
                            <p className="center-element">Aprašymas: {reservedOffer.description}</p>
                        </div>

                        <p className="center-element">Statusas: {reservedOffer.status}</p>

                        <p className="center-element">Naudotojo vertinimas: {reservedOffer.userRating}<Image fluid src={star} /></p>
                        <p className="center-element">Kaina: {reservedOffer.price *reservedOffer.timeForOffer} €</p>

                        <p className="center-element">Pradžia: {new Date(reservedOffer.reservedTimeDay).toISOString().substr(0, 10)} {reservedOffer.reservedTimeHour}</p>
                        <div className="center-element">
                            <Button onClick={() => handleProgressModalShow()} style={{marginRight: "2rem"}} variant="outline-dark">Keisti progreso vertinimą</Button>
                            <OfferProgressModalComponent title={reservedOffer.title} show={progressModalShow} onHide={() => handleProgressModalShow()} />
                            <Button onClick={() => handleReviewModalShow()} variant="outline-dark">Palikti atsiliepimą</Button>
                            <OfferReviewModalComponent title={reservedOffer.title} show={reviewModalShow} onHide={() => handleReviewModalShow()} />
                        </div>
                        <div style={{marginTop: "2rem"}} className="center-element">
                            <Button variant="outline-danger">Atšaukti užsakymą</Button>
                        </div>
                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Paslaugos teikėjas</h1>
                        <Image style={{display: "block", marginLeft: "auto", marginRight: "auto", height: "auto", width: "auto"}} className="center-element" fluid src={providerImage} alt="Paslaugos teikėjo nuotrauka" />
                        {/*@ts-ignore*/}
                        <p className="center-element"><Link to={{pathname: "/kitas",  query:{user: reservedOffer.username}}}>{reservedOffer.username}</Link></p>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => handleMessageModalShow()}>Išsiųsti žinutę</Button>
                            <UserSendMessageModalComponent reservedUser={reservedOffer.reservedUser} user={reservedOffer.user} username={reservedOffer.username} email={reservedOffer.userMail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
                        </div>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default OfferPaidComponent;