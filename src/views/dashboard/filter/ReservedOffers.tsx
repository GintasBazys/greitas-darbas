import React, {useState} from "react";
import {auth, db} from "../../../firebase";
import history from "../../../history";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import workInProgress from "../../../assets/work_in_progress.svg";
import {Link} from "react-router-dom";
import store from "../../../app/store";
import {setReservedOffer} from "../../../features/offers/offersSlice";
import PaymentModalComponent from "../PaymentModalComponent";
import CompletedOfferModalComponent from "../CompletedOfferModalComponent";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import LoadingComponent from "../../LoadingComponent";

interface Props {
    items: any,
    loading: any
}

const ReservedOffers = ({items, loading}: Props) => {
    if(loading) {
        return <LoadingComponent />
    }
    moment.locale("lt")


    const [paymentModalShow, setPaymentModalShow] = useState(false);


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
                            status: "Naudotojo atšaukta rezervacija",
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

    const [completedModalShow, setCompletedModalShow] = useState(false);

    const handleCompletedModalShow = () => {
        setCompletedModalShow(!completedModalShow);
    }


    return (
        <div>
            <div style={{display: "flex", marginLeft: "10rem"}}>
                {
                    items.map((item: any) => {
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
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
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
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
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
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
                                                </div>
                                            </Card.Body>
                                        </Card> : <div></div>
                                }

                                {
                                    item.status === "Laukiama mokėjimo" && item.user === auth.currentUser?.uid ?
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
                                                <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                    Laukite mokėjimo
                                                </div>
                                                <div style={{marginTop: "2rem"}}>
                                                    {/*@ts-ignore*/}
                                                    <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
                                                </div>
                                            </Card.Body>
                                        </Card> : <div></div>
                                }


                                {
                                    item.status === "Laukiama mokėjimo" && item.reservedUser === auth.currentUser?.uid ?
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
                                                    <Button variant="outline-dark" onClick={handlePaymentModalShow}>Atlikti mokėjimą</Button>
                                                    <PaymentModalComponent show={paymentModalShow} onHide={() => handlePaymentModalShow()} item={item} />
                                                </div>
                                                <div style={{marginTop: "2rem"}}>
                                                    <Button variant="outline-danger">Paslauga atlikta netinkamai</Button>
                                                </div>
                                                <div style={{marginTop: "2rem"}}>
                                                    {/*@ts-ignore*/}
                                                    <Link to={{pathname: "/kitas",  query:{user: item.user}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
                                                </div>
                                            </Card.Body>
                                        </Card> : <div></div>
                                }

                                {
                                    item.status === "Mokėjimas atliktas" && item.user === auth.currentUser?.uid ?
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
                                                <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                    Patvirtinkite mokėjimo gavimą
                                                </div>
                                                <div className="center-element">
                                                    <Button variant="outline-dark" onClick={handleCompletedModalShow}>Patvirtinti mokėjimo gavimą</Button>
                                                    <CompletedOfferModalComponent reservedOffer={item} onHide={() => handleCompletedModalShow()} show={completedModalShow} />
                                                </div>
                                                <div style={{marginTop: "2rem"}} className="center-element">
                                                    <Button variant="outline-danger">Negautas mokėjimas</Button>
                                                </div>
                                                <div style={{marginTop: "2rem"}}>
                                                    {/*@ts-ignore*/}
                                                    <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
                                                </div>
                                            </Card.Body>
                                        </Card> : <div></div>
                                }


                                {
                                    item.status === "Mokėjimas atliktas" && item.reservedUser === auth.currentUser?.uid ?
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
                                                <div className="alert alert-success" role="alert" style={{marginTop: "2rem"}}>
                                                    Atlikote mokėjimą sėkmingai
                                                </div>
                                                <div style={{marginTop: "2rem"}}>
                                                    {/*@ts-ignore*/}
                                                    <Link to={{pathname: "/kitas",  query:{user: item.user}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                    <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
                                                </div>
                                            </Card.Body>
                                        </Card> : <div></div>
                                }

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ReservedOffers;