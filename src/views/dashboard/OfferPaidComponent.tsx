import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {selectReservedOffer, setReservedOffer} from "../../features/offers/offersSlice";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import offerProgress from "../../assets/offer_progress.svg";
import moment from "moment";
import OfferReviewModalComponent from "./OfferReviewModalComponent";
import OfferProgressModalComponent from "./OfferProgressModalComponent";
import {db} from "../../firebase";
import store from "../../app/store";

const OfferPaidComponent = () => {

    const image = useSelector(selectImage)

    const reservedOffer = useSelector(selectReservedOffer);
    //console.log(reservedOffer);

    const [messageModalShow, setMessageModalShow] = useState(false);

    const handleMessageModalShow = () => {
        setMessageModalShow(!messageModalShow)
    }

    const [progressModalShow, setProgressModalShow] = useState(false);

    const handleProgressModalShow = (reservedOffer: any) => {
        store.dispatch(setReservedOffer(reservedOffer))
        setProgressModalShow(!progressModalShow)
    }

    const [reviewModalShow, setReviewModalShow] = useState(false);

    const handleReviewModalShow = (reservedOffer: any) => {
        store.dispatch(setReservedOffer(reservedOffer))
        setReviewModalShow(!reviewModalShow)
    }

    const confirmOfferCancel = async () => {
        console.log(reservedOffer.title)
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("reservedOffers").where("id", "==", reservedOffer.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("offers").doc(doc.id).update({
                            status: "Atšauktas naudotojo"
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
                                <Button onClick={() => handleProgressModalShow(reservedOffer)} style={{marginRight: "2rem"}} variant="outline-dark">Keisti progreso vertinimą</Button>
                                <OfferProgressModalComponent show={progressModalShow} onHide={() => handleProgressModalShow(reservedOffer)} />
                                <Button onClick={() => handleReviewModalShow(reservedOffer)} variant="outline-dark">Palikti atsiliepimą</Button>
                                <OfferReviewModalComponent show={reviewModalShow} onHide={() => handleReviewModalShow(reservedOffer)} />
                            </div>
                            {
                                reservedOffer.status === "Atlikta" ?
                                    <div>
                                        <Button variant="outline-dark">Atlikti mokėjimą</Button>
                                        <Button variant="outline-danger">Teikti skundą</Button>
                                    </div> :
                                    <div style={{marginTop: "2rem"}} className="center-element">
                                        <Button onClick={confirmOfferCancel} variant="outline-danger">Atšaukti užsakymą</Button>
                                    </div>
                            }

                        </div>
                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Paslaugos teikėjas</h1>
                        <div className="center-element">
                            <div style={{width: "80px", height: "80px", borderRadius: "50%", backgroundImage: `url(${reservedOffer.profileImage})`, backgroundSize: "cover", backgroundPosition: "center center"}}>

                            </div>
                        </div>

                        {/*@ts-ignore*/}
                        <p className="center-element"><Link to={{pathname: "/kitas",  query:{user: reservedOffer.user}}}>{reservedOffer.username}</Link></p>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => handleMessageModalShow()}>Išsiųsti žinutę</Button>
                            <UserSendMessageModalComponent user={reservedOffer.user} sender={reservedOffer.reservedUserEmail} receiver={reservedOffer.userMail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
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

export default OfferPaidComponent;