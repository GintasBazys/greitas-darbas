import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../../features/user/userSlice";
import {
    selectCategory,
    selectLocation,
    selectPrice, selectRating, selectStatus
} from "../../../features/filter/offersInProgressFilterSlice";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../../firebase";
import history from "../../../history";
import UserNavBarComponent from "../UserNavbarComponent";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import workInProgress from "../../../assets/work_in_progress.svg";
import moment from "moment";
import {Link} from "react-router-dom";
import store from "../../../app/store";
import {setReservedRequest} from "../../../features/requests/requestsSlice";
import RequestCompleteModalComponent from "../RequestCompleteModalComponent";

const FilteredRequestsInProgressPageComponent = () => {
    const image = useSelector(selectImage);
    const category = useSelector(selectCategory);
    const price = useSelector(selectPrice);
    const location = useSelector(selectLocation);
    const rating = useSelector(selectRating);
    const status = useSelector(selectStatus);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("requests").where("location", "==", location).where("status", "==", "rezervuotas").orderBy("budget", "desc"), {
            limit: 5
        }
    );

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
                    await db.collection("requestReview").doc(doc.id).set({
                        progressRating: 0,
                        comments: []
                    })
                    await history.go(0);
                })
            })
    }

    const [completedModalShow, setCompletedModalShow] = useState(false);

    const handleCompletedRequestModalComponent = (reservedRequest: any) => {
        setCompletedModalShow(!completedModalShow);
    }

    const confirmCancelByProvider = async (item: any) => {
        const confirmation = window.confirm("Patvirtinti");
        if (confirmation) {

            await db.collection("requests").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("requestReview").doc(doc.id).delete()
                        await db.collection("requests").doc(doc.id).delete()
                        await history.go(0)
                    })
                })
        }
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
                <div style={{display: "flex", marginLeft: "10rem"}}>
                    {
                        items.map((item) => {
                            return (
                                <div style={{display: "flex", flexDirection: "row"}}>
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
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
                                                    {/*@ts-ignore*/}
                                                    <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                                        <Card.Title>{item.title}</Card.Title>
                                                    </div>
                                                    <Card.Text>
                                                        {/*@ts-ignore*/}
                                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-success" role="alert" style={{marginTop: "2rem"}}>
                                                        Atlikote mokėjimą sėkmingai
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                        Patvirtinkite mokėjimo gavimą
                                                    </div>
                                                    <div className="center-element">
                                                        <Button variant="outline-dark" onClick={() => handleCompletedRequestModalComponent(item)}>Patvirtinti mokėjimo gavimą</Button>
                                                        <RequestCompleteModalComponent reservedRequest={item} onHide={() => handleCompletedRequestModalComponent(item)} show={completedModalShow} />
                                                    </div>
                                                    <div style={{marginTop: "2rem"}} className="center-element">
                                                        <Button variant="outline-danger">Negautas mokėjimas</Button>
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-dark" onClick={() => confirmCancelByProvider(item)}>Patvirtinti atšaukimą</Button>
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                                        Atšaukimas nepatvirtintas užsakovo
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                                        Atšaukimas nepatvirtintas darbuotojo
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
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    <ListGroupItem>Užsakovas: {item.userMail}</ListGroupItem>
                                                    <ListGroupItem>Vykdytojas: {item.reservedUserNameAndSurname}</ListGroupItem>
                                                    <ListGroupItem>Darbuotojo nr. {item.reservedUserPhoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Užsakovo nr. {item.phoneNumber}</ListGroupItem>
                                                    <ListGroupItem>Miestas: {item.location}</ListGroupItem>
                                                    <ListGroupItem>Adresas: {item.address}</ListGroupItem>
                                                    <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                                    <ListGroupItem>Biudžetas: {item.budget} €</ListGroupItem>
                                                    <ListGroupItem>Statusas: {item.status}</ListGroupItem>
                                                    <ListGroupItem>Naudotojo vertinimas: {Math.round(item.userRating)}</ListGroupItem>
                                                </ListGroup>
                                                <Card.Body>
                                                    <div className="alert alert-warning" role="alert" style={{marginTop: "2rem"}}>
                                                        <Button variant="outline-dark" onClick={() => confirmCancelByProvider(item)}>Patvirtinti atšaukimą</Button>
                                                    </div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {/*@ts-ignore*/}
                                                        <Link to={{pathname: "/kitas",  query:{user: item.reservedUser}}} style={{marginRight: "2rem"}}>Profilis</Link>
                                                        <Card.Link href={`mailto:${item.reservedUserEmail}`}>Susiekti el. paštu</Card.Link>
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
                    items.length === 0 ? <div style={{marginTop: "2rem"}} className="center-element">Daugiau skelbimų nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                }

            </div>
    )
}

export default FilteredRequestsInProgressPageComponent;