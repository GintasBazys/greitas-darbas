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
import store from "../../app/store";
import {setReservedOffer} from "../../features/offers/offersSlice";

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

            await db.collection("reservedOffers").where("id", "==", item.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Atšaukta rezervacija",
                        })

                        await history.go(0);
                    })
                })
        }
    }

    const confirmReservation = async (item: any) => {
        const confirmation = window.confirm("Patvirtinti rezervaciją");
        if (confirmation) {

            await db.collection("reservedOffers").where("id", "==", item.id).limit(1).get()
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

    const cancelReservationByUser = async (item: any) => {
        const confirmation = window.confirm("Atšaukti vykdymą");
        if (confirmation) {

            await db.collection("reservedOffers").where("id", "==", item.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Atšaukta naudotojo",
                        })

                        await history.go(0);
                    })
                })
        }
    }

    const cancelReservationByProvider = async (item: any) => {
        const confirmation = window.confirm("Atšaukti vykdymą");
        if (confirmation) {

            await db.collection("reservedOffers").where("id", "==", item.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Atšaukta teikėjo",
                        })

                        await history.go(0);
                    })
                })
        }
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
                <div style={{display: "flex", marginLeft: "10rem"}}>
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
                                                    <ListGroupItem>{item.address}</ListGroupItem>
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
                                                    <ListGroupItem>{item.address}</ListGroupItem>
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
                                        (item.status === "Patvirtinta" || item.status === "Atliktas" || item.status === "Vykdomas" || item.status === "Atidėtas") && item.user === auth.currentUser?.uid ?
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
                                                    <ListGroupItem>{item.address}</ListGroupItem>
                                                    <ListGroupItem>{moment(item.reservedDay).format("YYYY-MM-DD")} - {item.reservedHour}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark" onClick={() => {history.push("/vykdymas/teikejas"), store.dispatch(setReservedOffer(item))}}>Peržiūrėti progresą</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationByProvider(item)}>Atšaukti</Button>
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
                                        (item.status === "Patvirtinta" || item.status === "Atliktas" || item.status === "Vykdomas" || item.status === "Atidėtas") && item.reservedUser === auth.currentUser?.uid ?
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
                                                    <ListGroupItem>{item.address}</ListGroupItem>
                                                    <ListGroupItem>{moment(item.reservedDay).format("YYYY-MM-DD")} - {item.reservedHour}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark" onClick={() => {history.push("/vykdymas/progresas"), store.dispatch(setReservedOffer(item))}}>Peržiūrėti progresą</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationByUser(item)}>Atšaukti</Button>
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