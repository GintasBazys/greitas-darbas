import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage, selectUserEmail} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import history from "../../history";
import {Button, Card, Form, Image, ListGroup, ListGroupItem} from "react-bootstrap";
import star from "../../assets/star.svg";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import UserRequestModalComponent from "./UserRequestModalComponent";
import store from "../../app/store";
import {setRequest} from "../../features/requests/requestsSlice";
import searchIcon from "../../assets/search.svg";
import FilterOffersModalComponent from "./filter/FilterOffersModalComponent";
import FilterRequestsModalComponent from "./filter/FilterRequestsModalComponent";

const UserWorkforceViewComponent = () => {
    const image = useSelector(selectImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("requests").orderBy("user").where("user", "!=", auth.currentUser?.uid).orderBy("createdOn").where("status", "==", "naujas"), {
            limit: 5
        }
    );

    const userEmail = useSelector(selectUserEmail);

    const reserveRequest = async (item: { title: string; }) => {

        const confirm = window.confirm("Patvirtinti?");
        if(confirm) {
            let docId = ""
            await db.collection("requests").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        docId = doc.id;
                    })
                })
            await db.collection("requests").doc(docId).update({
                status: "rezervuotas",
                reservedUser: auth.currentUser?.uid,
                reservedUserEmail: userEmail
            })
            await history.go(0);
        }

    }

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = async (item: any) => {
        await store.dispatch(setRequest(item));
        await setModalShow(!modalShow);

    }

    const [filterModalShow, setFilterModalShow] = useState(false);

    const filter = () => {
        setFilterModalShow(!filterModalShow);
    }

    const [search, setSearch] = useState("");

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    }

    moment.locale("lt")
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
                            <Button variant="outline-dark" onClick={filter}>Filtruoti skelbimus</Button>
                            <FilterRequestsModalComponent show={filterModalShow} onHide={() => filter()} />
                        </div>

                    </Form.Group>

                </div>
                <div style={{display: "flex", marginLeft: "10rem"}}>
                    {
                        items.map((item) => {
                            return (
                                <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                    <Card.Img variant="top" src={item.profileImage} style={{maxWidth: "100%", height: "400px"}}/>
                                    <Card.Body>
                                        {/*@ts-ignore*/}
                                        <div style={{display: "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>
                                            <Card.Title style={{minHeight: "48px"}}>{item.title}</Card.Title>
                                        </div>
                                        <Card.Text>
                                            {/*@ts-ignore*/}
                                            <div style={{ display: "-webkit-box", "-webkit-line-clamp": "3", "-webkit-box-orient": "vertical", overflow: "hidden", textOverflow: "elipsis"}}>{item.description}</div>
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroupItem>{item.nameAndSurname} {item.userRating}<Image style={{marginLeft: "1px"}} src={star} fluid/></ListGroupItem>
                                        <ListGroupItem>Terminas: {moment(item.term).format("YYYY-MM-DD")}</ListGroupItem>
                                        <ListGroupItem>Biudžetas: {item.budget}€</ListGroupItem>
                                        <ListGroupItem>{item.phoneNumber}</ListGroupItem>
                                        <ListGroupItem>Vietovė: {item.location}, {item.address === "" ? <div>Nenurodyta tiksli vieta</div> : <div>{item.address}</div>}</ListGroupItem>
                                    </ListGroup>
                                    <Card.Body>
                                        <div>
                                            <Button variant="outline-dark" onClick={() => handleModalShow(item)}>Peržiūrėti visą informaciją</Button>
                                            <UserRequestModalComponent show={modalShow} onHide={() => handleModalShow(item)}/>
                                        </div>
                                        <div style={{marginTop: "2rem"}}>
                                            <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )

                        })
                    }
                </div>

                {
                    items.length === 0 ? <div className="center-element" style={{marginTop: "2rem"}}>Daugiau skelbimų nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                }

            </div>

        </div>
    )
}

export default UserWorkforceViewComponent