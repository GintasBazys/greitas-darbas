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
import history from "../../history";
import axios from "axios";

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

    const cancelRequest = async () => {
        console.log(reservedRequest.title)
        const response = window.confirm("Patvirtinti?");

        if (response) {
            await db.collection("requests").where("title", "==", reservedRequest.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("requests").doc(doc.id).update({
                            status: "Atšauktas darbuotojo"
                        })
                        await history.go(0);
                    })
                })

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
                                    <div>
                                        <div className="center-element">
                                            <Button variant="outline-dark" onClick={handleProgressModalShow}>Keisti vykdymo būseną</Button>
                                            <RequestsChangeProgressModalComponent show={progressModalShow} onHide={() => handleProgressModalShow()} title={reservedRequest.title} />
                                            <Button style={{marginLeft: "2rem"}} variant="outline-dark">Peržiūrėti komentarus</Button>
                                        </div>
                                        <div style={{marginTop: "2rem"}} className="center-element">
                                            <Button variant="outline-danger" onClick={cancelRequest}>Atšaukti užsakymą</Button>
                                        </div>
                                    </div>
                                </div> : <div></div>
                        }
                        {
                            reservedRequest.status === "Atliktas" ?
                                <div className="alert alert-warning center-element" role="alert">
                                    <p>Laukite kol įvykdymas bus patvirtintas</p>
                                </div> : <div></div>
                        }
                        {
                            reservedRequest.status === "Atšauktas užsakovo" ?
                                <div className="center-element">
                                    <Button onClick={() => initiateRefund(reservedRequest)} variant="outline-dark">Patvirtinti atšaukimą</Button>
                                </div>: <div></div>
                        }
                        {
                            reservedRequest.status === "Atšauktas užsakovo" ?
                                <div className="center-element alert alert-warning" role="alert">
                                    <p>Laukite kol užsakovas patvirtins atšaukimą</p>
                                </div>: <div></div>
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