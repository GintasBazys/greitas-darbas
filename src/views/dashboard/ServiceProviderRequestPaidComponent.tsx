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
import CompletedOfferModalComponent from "./CompletedOfferModalComponent";
import CompletedRequestModalComponent from "./CompletedRequestModalComponent";
import axios from "axios";

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

    const handleCompletedOfferModalComponent = () => {
        setCompletedModalShow(!completedModalShow);
    }

    const transferPayment = async (reservedOffer: any) => {
        const confirmation = window.confirm(`Patvirtinti įvykdymą`);

        if (confirmation) {
            handleCompletedOfferModalComponent();
        }
    }

    const initiateRefund = async (reservedRequest: any) => {
        const confirmation = window.confirm(`Patvirtinti darbo nutraukimą?`);
        if (confirmation) {
            try {
                const response = await axios.post(
                    "http://localhost:8080/stripe/darbas/grazinimas",
                    {
                        id: reservedRequest.paymentId,
                    }
                );
                console.log(response.data.success);
                if (response.data.success) {
                    await db.collection("requests").where("title", "==", reservedRequest.title).limit(1).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach(async (doc) => {
                                let docBeforeDelete = doc.id;
                                await db.collection("requests").doc(doc.id).delete();
                                let progressRating = 0;

                                await db.collection("requestReview").doc(docBeforeDelete).get()
                                    .then((doc) => {
                                        progressRating = doc.data()?.progressRating;
                                    }).then(() => {
                                        db.collection("requestReview").doc(docBeforeDelete).delete()
                                    })
                                let rating: number = 0;
                                await db.collection("users").doc(reservedRequest.reservedUser).get()
                                    .then((doc) => {
                                        let ratingCount: number = doc.data()?.ratingCount + 1;
                                        rating = doc.data()?.rating;
                                        db.collection("users").doc(reservedRequest.reservedUser).update({
                                            rating: rating + progressRating / ratingCount,
                                            ratingCount: ratingCount
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
                                    <div className="center-element">
                                        <Button onClick={() => handleProgressModalShow()} style={{marginRight: "2rem"}} variant="outline-dark">Keisti progreso vertinimą</Button>
                                        <RequestsProgressModalComponent title={reservedRequest.title} show={progressModalShow} onHide={() => handleProgressModalShow()} />
                                        <Button onClick={() => handleReviewModalShow()} variant="outline-dark">Palikti atsiliepimą</Button>
                                        <RequestsReviewModalComponent title={reservedRequest.title} show={reviewModalShow} onHide={() => handleReviewModalShow()} />
                                    </div>
                                    <div style={{marginTop: "2rem"}} className="center-element">
                                        <Button variant="outline-danger" onClick={cancelRequest}>Atšaukti užsakymą</Button>
                                    </div>
                                </div>
                                : <div></div>
                        }

                        {
                            reservedRequest.status === "Atliktas" ?
                                <div className="center-element">
                                    <Button variant="outline-dark" onClick={() => transferPayment(reservedRequest)}>Patvirtinkite įvykdymą</Button>
                                    <CompletedRequestModalComponent show={completedModalShow} reservedRequest={reservedRequest} onHide={() => handleCompletedOfferModalComponent()} />
                                </div> : <div></div>
                        }
                        {
                            reservedRequest.status === "Atšauktas užsakovo" ?
                                <div className="center-element alert alert-warning" role="alert">
                                    <p>Laukite kol darbuotojas patvirtins atšaukimą</p>
                                </div>: <div></div>
                        }
                        {
                            reservedRequest.status === "Atšauktas darbuotojo" ?
                                <div className="center-element">
                                    <Button onClick={() => initiateRefund(reservedRequest)} variant="outline-dark">Patvirtinti atšaukimą</Button>
                                </div>: <div></div>
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
                            <UserSendMessageModalComponent user={reservedRequest.reservedUser} receiver={reservedRequest.reservedUserEmail} sender={reservedRequest.userMail} show={messageModalShow} onHide={() => handleMessageModalShow()}/>
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