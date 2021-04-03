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
import history from "../../history";
import axios from "axios";
import offerProgress from "../../assets/offer_progress.svg";
import CompletedOfferModalComponent from "./CompletedOfferModalComponent";

const OfferPaidComponent = () => {

    const image = useSelector(selectImage)

    const reservedOffer = useSelector(selectReservedOffer)
    const [providerImage, setProviderImage] = useState("");
    const [docId, setDocId] = useState("");

    useEffect(() => {
        db.collection("users").doc(reservedOffer.user).get()
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

    const [reviewModalShow, setReviewModalShow] = useState(false);

    const handleReviewModalShow = () => {
        setReviewModalShow(!reviewModalShow)
    }

    const confirmOfferCancel = async () => {
        console.log(reservedOffer.title)
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("offers").where("title", "==", reservedOffer.title).limit(1).get()
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

    const initiateRefund = async (reservedOffer: any) => {
        //console.log(reservedOffer);
        const confirmation = window.confirm(`Patvirtinti gražinimą? Suma: ${reservedOffer.price * reservedOffer.timeForOffer}`);
        if (confirmation) {
            try {
               const response = await axios.post(
                    "http://localhost:8080/stripe/grazinimas",
                    {
                        id: reservedOffer.paymentId,
                    }
                );
               console.log(response.data.success);
                if (response.data.success) {
                    await db.collection("offers").where("title", "==", reservedOffer.title).limit(1).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach(async (doc) => {
                                await db.collection("offers").doc(doc.id).update({
                                    status: "naujas",
                                    reservedTimeDay: "",
                                    reservedTimeHour: "",
                                    reservedUser: "",
                                    reservedUserEmail: "",
                                    paymentId: "",
                                    paymentStatus: "",
                                    timeForOffer: ""
                                })
                                let progressRating = 0;

                                await db.collection("offerReview").doc(doc.id).get()
                                    .then((doc) => {
                                         progressRating = doc.data()?.progressRating;
                                    }).then(() => {
                                        db.collection("offerReview").doc(doc.id).delete()
                                    })
                                let rating: number = 0;
                                await db.collection("users").doc(docId).get()
                                    .then((doc) => {
                                        let ratingCount: number = doc.data()?.ratingCount +1;
                                        rating = doc.data()?.rating;
                                        db.collection("users").doc(docId).update({
                                            rating: rating + progressRating / ratingCount,
                                            ratingCount: ratingCount
                                        }).then(() => {
                                             db.collection("offers").doc(doc.id).update({
                                                userRating: rating + progressRating / ratingCount,
                                            })
                                        })
                                    })

                                await history.go(0);
                            })
                        })
                   //
                }

            } catch (e) {

            }
        }
    }
    const [completedModalShow, setCompletedModalShow] = useState(false);

    const handleCompletedOfferModalComponent = () => {
        setCompletedModalShow(!completedModalShow);
    }

    const transferPayment = async (reservedOffer: any) => {
        const confirmation = window.confirm(`Patvirtinti įvykdymą`);

        if (confirmation) {
            handleCompletedOfferModalComponent();
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

                        <p className="center-element">Naudotojo vertinimas: {Math.round(reservedOffer.userRating)}<Image fluid src={star} /></p>
                        <p className="center-element">Kaina: {reservedOffer.price *reservedOffer.timeForOffer} €</p>

                        <p className="center-element">Pradžia: {new Date(reservedOffer.reservedTimeDay).toISOString().substr(0, 10)} {reservedOffer.reservedTimeHour}</p>
                        {
                            reservedOffer.status === "Mokėjimas atliktas" ?
                                    <div>
                                        <div className="center-element">
                                            <Button onClick={() => handleProgressModalShow()} style={{marginRight: "2rem"}} variant="outline-dark">Keisti progreso vertinimą</Button>
                                            <OfferProgressModalComponent title={reservedOffer.title} show={progressModalShow} onHide={() => handleProgressModalShow()} />
                                            <Button onClick={() => handleReviewModalShow()} variant="outline-dark">Palikti atsiliepimą</Button>
                                            <OfferReviewModalComponent title={reservedOffer.title} show={reviewModalShow} onHide={() => handleReviewModalShow()} />
                                        </div>
                                        <div style={{marginTop: "2rem"}} className="center-element">
                                            <Button onClick={confirmOfferCancel} variant="outline-danger">Atšaukti užsakymą</Button>
                                        </div>
                                    </div> : <div></div>
                        }
                        {
                            reservedOffer.status === "Atšauktas naudotojo" ? <div className="alert alert-warning" role="alert">
                                    <p className="center-element">Laukite kol paslaugos teikėjas patvirtins atšaukimą</p>
                            </div> : <div></div>
                        }
                        {
                            reservedOffer.status === "Atšaukimas patvirtintas" ?
                                <div className="center-element">
                                    <Button onClick={() => initiateRefund(reservedOffer)} variant="outline-dark">Gražinti mokėjimą</Button>
                                </div>: <div></div>
                        }
                        {
                            reservedOffer.status === "Atliktas" ?
                                <div className="center-element">
                                    <Button variant="outline-dark" onClick={() =>transferPayment(reservedOffer)}>Patvirtinkite įvykdymą</Button>
                                    <CompletedOfferModalComponent show={completedModalShow} reservedOffer={reservedOffer} onHide={() => handleCompletedOfferModalComponent()} />
                                </div> :<div></div>
                        }

                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Paslaugos teikėjas</h1>
                        <div className="center-element">
                            <div style={{width: "80px", height: "80px", borderRadius: "50%", backgroundImage: `url(${providerImage})`, backgroundSize: "cover", backgroundPosition: "center center"}}>

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