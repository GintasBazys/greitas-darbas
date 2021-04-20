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
import store from "../../app/store";
import {setReservedRequest} from "../../features/requests/requestsSlice";
import history from "../../history";
import searchIcon from "../../assets/search.svg";
import FilterOffersModalComponent from "./filter/FilterOffersModalComponent";
import workInProgress from "../../assets/work_in_progress.svg";
import CompletedOfferModalComponent from "./CompletedOfferModalComponent";
import RequestCompleteModalComponent from "./RequestCompleteModalComponent";


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