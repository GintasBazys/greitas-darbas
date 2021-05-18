import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Link} from "react-router-dom";
import {Button, Card, Form, Image, ListGroup, ListGroupItem} from "react-bootstrap";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import history from "../../history";
import workInProgress from "../../assets/work_in_progress.svg";
import searchIcon from "../../assets/search.svg";
import store from "../../app/store";
import {setReservedOffer} from "../../features/offers/offersSlice";
import PaymentModalComponent from "./PaymentModalComponent";
import CompletedOfferModalComponent from "./CompletedOfferModalComponent";
import FilterOffersInProgressModalComponent from "./filter/FilterOffersInProgressModalComponent";
import {setFilteredSearch} from "../../features/filter/offersInProgressFilterSlice";

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
                            status: "Naudotojo atšaukta rezervacija",
                        })

                        await history.go(0);
                    })
                })
        }
    }

    const cancelReservationWithoutPayByProvider = async (item: any) => {
        const confirmation = window.confirm("Atšaukti rezervaciją");
        if (confirmation) {

            await db.collection("reservedOffers").where("id", "==", item.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).update({
                            status: "Teikėjo atšaukta rezervacija",
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

    const confirmCancel = async (item: any) => {
        const confirmation = window.confirm("Patvirtinti");
        if (confirmation) {

            await db.collection("reservedOffers").where("id", "==", item.id).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("reservedOffers").doc(doc.id).delete()
                        await db.collection("offerReview").doc(doc.id).delete()
                        await history.go(0);
                    })
                })
        }
    }

    const [completedModalShow, setCompletedModalShow] = useState(false);

    const handleCompletedModalShow = () => {
        setCompletedModalShow(!completedModalShow);
    }

    const [search, setSearch] = useState("");

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    }

    const [filterModalShow, setFilterModalShow] = useState(false);

    const filter = () => {
        setFilterModalShow(!filterModalShow);
    }
    const searchOffersInProgress = async () => {
        await store.dispatch(setFilteredSearch(search));
        await history.push("/paslauga/vykdymas/paieska");
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

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div>
                <div style={{marginTop: "2rem"}}  className="center-element">
                    <Form.Group>
                        <Form.Label>Ieškoti</Form.Label>
                        <Form.Control type="text" placeholder="..." value={search} onChange={handleSearchChange} />
                        <div className="center-element">
                            <Button variant="outline-dark" style={{marginRight: "2rem"}} onClick={searchOffersInProgress}><Image src={searchIcon} fluid /> Ieškoti</Button>
                            <Button variant="outline-dark" onClick={filter}>Filtruoti pasiūlymus</Button>
                            <FilterOffersInProgressModalComponent show={filterModalShow} onHide={() => filter()} />
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.nameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark" onClick={() => confirmReservation(item)}>Patvirtinti rezervaciją</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservationWithoutPayByProvider(item)}>Atšaukti rezervaciją</Button>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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
                                        item.status === "Naudotojo atšaukta rezervacija" && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert">
                                                        <Button variant="outline-dark" onClick={() => confirmCancel(item)}>Patvirtinti rezervacijos atšaukimą</Button>
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
                                        item.status === "Naudotojo atšaukta rezervacija" && item.reservedUser === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-success" role="alert">
                                                        Laukite atšaukimo patvirtinimo
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
                                        item.status === "Teikėjo atšaukta rezervacija" && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-success" role="alert">
                                                        Laukite atšaukimo patvirtinimo
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
                                        item.status === "Teikėjo atšaukta rezervacija" && item.reservedUser === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert">
                                                        <Button variant="outline-dark" onClick={() => confirmCancel(item)}>Patvirtinti rezervacijos atšaukimą</Button>
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
                                        (item.status === "Patvirtinta" || item.status === "Atliktas" || item.status === "Vykdomas" || item.status === "Atidėtas") && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
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

                                    {
                                        item.status === "Atšaukta naudotojo" && item.reservedUser === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                                        Atšaukimas nepatvirtintas paslaugos teikėjo
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
                                        item.status === "Atšaukta naudotojo" && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-dark" onClick={() => confirmCancel(item)}>Patvirtinti atšaukimą</Button>
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
                                        item.status === "Atšaukta teikėjo" && item.reservedUser === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-dark" onClick={() => confirmCancel(item)}>Patvirtinti atšaukimą</Button>
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
                                        item.status === "Atšaukta teikėjo" && item.user === auth.currentUser?.uid ?
                                            <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                                <Card.Img variant="top" src={workInProgress} />
                                                <Card.Body>
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                    <ListGroup className="list-group-flush">
                                                        <ListGroupItem>Užsakovas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                        <ListGroupItem>Vykdytojas: {item.userMail}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos vykdytojo nr. {item.phoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Paslaugos užsakovo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                        <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                        <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                        <ListGroupItem>Pradžia: {moment(item.reservedDay).format("YYYY-MM-DD")} {item.reservedHour}</ListGroupItem>
                                                        <ListGroupItem>Valandine kaina: {item.price} €</ListGroupItem>
                                                        <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    </ListGroup>
                                                </Card.Body>
                                                <Card.Body>
                                                    <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                                        Atšaukimas nepatvirtintas naudotojo
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