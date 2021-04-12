import React, {useState} from "react";
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
import RequestPaymentModalComponent from "./RequestPaymentModalComponent";
import store from "../../app/store";
import {setReservedRequest} from "../../features/requests/requestsSlice";
import history from "../../history";
import searchIcon from "../../assets/search.svg";
import FilterOffersModalComponent from "./filter/FilterOffersModalComponent";
import workInProgress from "../../assets/work_in_progress.svg";
import {setReservedOffer} from "../../features/offers/offersSlice";


const UserRequestsInProgressComponent = () => {
    const image = useSelector(selectImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("requests").where("status", "!=", "naujas").orderBy("status"), {
            limit: 20
        }
    );

    const [search, setSearch] = useState("");

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    }

    const [filterModalShow, setFilterModalShow] = useState(false);

    const filter = () => {
        setFilterModalShow(!filterModalShow);
    }

    const cancelReservation = async (item: any) => {
        const response = window.confirm("Patvirtinti atšaukimą?");

        if (response) {
            await db.collection("requests").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("requests").doc(doc.id).update({
                            status: "naujas",
                            reservedUserNameAndSurname: "",
                            reservedUserPhoneNumber: "",
                            paymentStatus: "",
                            reservedUser: ""
                        })
                        await history.go(0);
                    })
                })
        }
    }

    const confirmReservation = async (item: any) => {
        await db.collection("requests").where("title", "==", item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    await db.collection("requests").doc(doc.id).update({
                        status: "Patvirtinta",
                    })
                    await db.collection("offerReview").doc(doc.id).set({
                        progressRating: 0,
                        comments: []
                    })
                    await history.go(0);
                })
            })
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
                            <FilterOffersModalComponent show={filterModalShow} onHide={() => filter()} />
                        </div>

                    </Form.Group>

                </div>

                <div style={{display: "flex", marginLeft: "10rem"}}>
                    {
                        items.map((item) => {
                            return (
                                <div>
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
                                                    <ListGroupItem>Užsakovas: {item.nameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Atlikimo vieta: {item.location}</ListGroupItem>
                                                    <ListGroupItem>{item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.reservedDay).format("YYYY-MM-DD")}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-warning center-element" role="alert">
                                                        <p>Laukite patvirtinimo iš užsakovo</p>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservation(item)}>Atšaukti rezervaciją</Button>
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
                                                    <ListGroupItem>Darbuotojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Atlikimo vieta: {item.location}</ListGroupItem>
                                                    <ListGroupItem>{item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.reservedDay).format("YYYY-MM-DD")}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div>
                                                        <Button variant="outline-dark" onClick={() => confirmReservation(item)}>Patvirtinti darbo pradžią</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-danger" onClick={() => cancelReservation(item)}>Atšaukti rezervaciją</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.reservedUserEmail}`}>Susiekti el. paštu</Card.Link>
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
                                                    <ListGroupItem>Darbuotojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Atlikimo vieta: {item.location}</ListGroupItem>
                                                    <ListGroupItem>{item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.reservedDay).format("YYYY-MM-DD")}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-dark" onClick={() => {store.dispatch(setReservedRequest(item)), history.push("/darbas/vykdymas/teikejas")}}>Peržiūrėti progresą</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.reservedUserEmail}`}>Susiekti el. paštu</Card.Link>
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
                                                    <ListGroupItem>Užsakovas: {item.nameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>{item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Atlikimo vieta: {item.location}</ListGroupItem>
                                                    <ListGroupItem>{item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.reservedDay).format("YYYY-MM-DD")}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-dark" onClick={() => {store.dispatch(setReservedRequest(item)), history.push("/darbas/vykdymas/progresas")}}>Peržiūrėti progresą</Button>
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
                    items.length === 0 ? <div style={{marginTop: "2rem"}}>Daugiau skelbimų nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                }

            </div>
        </div>
    )
}

export default UserRequestsInProgressComponent;