import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Link} from "react-router-dom";
import {Button, Card, Form, Image, ListGroup, ListGroupItem} from "react-bootstrap";
import star from "../../assets/star.svg";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import history from "../../history";
import axios from "axios";
import workInProgress from "../../assets/work_in_progress.svg";
import searchIcon from "../../assets/search.svg";

const UserOffersInProgressComponent = () => {
    const image = useSelector(selectImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("reservedOffers").where("status", "!=", "naujas").orderBy("status"), {
            limit: 5
        }
    );

    const [modalShow, setModalShow] = useState(false);
    const [paymentModalShow, setPaymentModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow);
    }

    const handlePaymentModalShow = () => {
        setPaymentModalShow(!paymentModalShow);
    }

    const cancelReservationWithoutPay = async (item: any) => {
        const confirmation = window.confirm("Atšaukti rezervaciją");
        if (confirmation) {

            await db.collection("reservedOffers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Atšaukta nesumokėjus",
                        })

                        await history.go(0);
                    })
                })
        }
    }

    const confirmReservation = async (item: any) => {
        const confirmation = window.confirm("Patvirtinti rezervaciją");
        if (confirmation) {

            await db.collection("reservedOffers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Patvirtinta",
                        })

                        await history.go(0);
                    })
                })
        }
    }

    const initiateRefund = async (item: any) => {
        console.log(item.price);
        const confirmation = window.confirm(`Patvirtinti gražinimą? Suma: € ${item.price * item.timeForOffer}`);
        if (confirmation) {
            try {
                const response = await axios.post(
                    "http://localhost:8080/stripe/grazinimas",
                    {
                        id: item.paymentId,
                    }
                );
                console.log(response.data.success);
                if (response.data.success) {
                    await db.collection("offers").where("title", "==", item.title).limit(1).get()
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
                                await db.collection("users").doc(item.user).get()
                                    .then((doc) => {
                                        let ratingCount: number = doc.data()?.ratingCount +1;
                                        rating = doc.data()?.rating;
                                        db.collection("users").doc(item.user).update({
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

    const confirmCancelWithoutPay = async (item: any) => {
        // await db.collection("offers").where("title", "==", item.title).limit(1).get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach(async (doc) => {
        //             await db.collection("offers").doc(doc.id).update({
        //                 status: "naujas",
        //                 reservedTimeDay: "",
        //                 reservedTimeHour: "",
        //                 reservedUser: "",
        //                 reservedUserEmail: "",
        //                 paymentId: "",
        //                 paymentStatus: "",
        //                 timeForOffer: ""
        //             })
        //             await history.go(0);
        //         })
        //     })
    }

    const [search, setSearch] = useState("");

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    }
    const filter = () => {
        // db.collection("offers").where("experienceLevel", "==", "Ekspertas").where("price", "==", "15").get()
        //     .then((querySnapshot) => {
        //         console.log(querySnapshot.docs.length);
        //     })
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div>
                <div style={{marginTop: "2rem"}}  className="center-element">
                    <Form.Group>
                        <Form.Label>Ieškoti</Form.Label>
                        <Form.Control type="text" placeholder="..." value={search} onChange={handleSearchChange} />
                        <div className="center-element">
                            <Button variant="outline-dark" style={{marginRight: "2rem"}}><Image src={searchIcon} fluid /> Ieškoti</Button>
                            <Button variant="outline-dark" onClick={filter}>Filtruoti pasiūlymus</Button>
                        </div>

                    </Form.Group>

                </div>
                <div style={{display: "flex"}}>
                    {
                        items.map((item) => {
                            console.log(item.status);
                            return (
                                <div>
                                    {
                                        item.status === "rezervuotas" && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                    <Card.Text>
                                                        {
                                                            item.description.length >= 100 ? <div>{item.description.slice(0, 100)}...</div> : <div>{item.description}</div>
                                                        }
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>{item.location}</ListGroupItem>
                                                    <ListGroupItem>{moment(item.reservedDay).format("YYYY-MM-DD")} - {item.reservedHour}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark" onClick={() => confirmReservation(item)}>Patvirtinti rezervaciją</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationWithoutPay(item)}>Atšaukti rezervaciją</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.email}`}>Susiekti el. paštu</Card.Link>
                                                    </div>
                                                </Card.Body>
                                            </Card> : <div></div>
                                    }
                                    {
                                        item.status === "rezervuotas" && item.reservedUser === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                    <Card.Text>
                                                        {
                                                            item.description.length >= 100 ? <div>{item.description.slice(0, 100)}...</div> : <div>{item.description}</div>
                                                        }
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>{item.location}</ListGroupItem>
                                                    <ListGroupItem>{moment(item.reservedDay).format("YYYY-MM-DD")} - {item.reservedHour}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-warning center-element" role="alert">
                                                        <p>Laukite patvirtinimo</p>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationWithoutPay(item)}>Atšaukti rezervaciją</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.user}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.email}`}>Susiekti el. paštu</Card.Link>
                                                    </div>
                                                </Card.Body>
                                            </Card> : <div></div>
                                    }
                                    {
                                        item.status === "Patvirtinta" && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                    <Card.Text>
                                                        {
                                                            item.description.length >= 100 ? <div>{item.description.slice(0, 100)}...</div> : <div>{item.description}</div>
                                                        }
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>{item.location}</ListGroupItem>
                                                    <ListGroupItem>{moment(item.reservedDay).format("YYYY-MM-DD")} - {item.reservedHour}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark">Peržiūrėti progresą</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationWithoutPay(item)}>Atšaukti</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.email}`}>Susiekti el. paštu</Card.Link>
                                                    </div>
                                                </Card.Body>
                                            </Card> : <div></div>
                                    }
                                    {
                                        item.status === "Patvirtinta" && item.reservedUser === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    <Card.Title>{item.title}</Card.Title>
                                                    <Card.Text>
                                                        {
                                                            item.description.length >= 100 ? <div>{item.description.slice(0, 100)}...</div> : <div>{item.description}</div>
                                                        }
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>{item.location}</ListGroupItem>
                                                    <ListGroupItem>{moment(item.reservedDay).format("YYYY-MM-DD")} - {item.reservedHour}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark">Peržiūrėti progresą</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationWithoutPay(item)}>Atšaukti</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.user}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.email}`}>Susiekti el. paštu</Card.Link>
                                                    </div>
                                                </Card.Body>
                                            </Card> : <div></div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>

                {
                    items.length === 0 ? <div style={{marginTop: "2rem"}}>Nėra vykdomų pasiūlymų<Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                }

            </div>

        </div>
    )
}

export default UserOffersInProgressComponent;