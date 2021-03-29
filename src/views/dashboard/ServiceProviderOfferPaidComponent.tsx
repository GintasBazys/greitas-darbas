import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {selectReservedOffer} from "../../features/offers/offersSlice";
import {db} from "../../firebase";
import {Link} from "react-router-dom";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import star from "../../assets/star.svg";
import history from "../../history";

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
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("offers").where("title", "==", reservedOffer.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection("offers").doc(doc.id).update({
                            status: "Atšaukimas patvirtintas"
                        })
                    })
                })
           await history.go(0);
        }
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
                        {
                            reservedOffer.status === "Atšauktas naudotojo" ?
                                <div className="alert alert-warning center-element" role="alert">
                                    <Button onClick={confirmOfferCancel} style={{marginRight: "2rem"}} variant="outline-dark">Patvirtinti atšaukimą</Button>
                                    <Button variant="outline-danger">Atmesti paslaugos atšaukimo prašymą</Button>
                                </div> : <div></div>
                        }
                        {
                            reservedOffer.status === "Mokėjimas atliktas" ?
                                <div className="center-element">
                                    <p>Keisti vykdymo būseną</p>
                                </div> : <div></div>
                        }
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
            </Container>
        </div>
    )
}

export default ServiceProviderOfferPaidComponent;