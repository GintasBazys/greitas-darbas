import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage, selectUserEmail} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Button, Card, Form, Image, ListGroup, ListGroupItem} from "react-bootstrap";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import {Link} from "react-router-dom";
import star from "../../assets/star.svg";
import searchIcon from "../../assets/search.svg";
import UserOfferModalComponent from "./UserOfferModalComponent";
import history from "../../history";
import store from "../../app/store";
import {setOffer} from "../../features/offers/offersSlice";

const UserOffersViewComponent = () => {

    const userEmail = useSelector(selectUserEmail);
    const image = useSelector(selectImage);
    //.where("status", "==", "naujas").where("status", "==", "atnaujintas")


    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("offers").orderBy("user").where("user", "!=", auth.currentUser?.uid).orderBy("createdOn").where("status", "==", "naujas"), {
            limit: 5
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = async (item: any) => {
        await store.dispatch(setOffer(item));
        await setModalShow(!modalShow);

    }

    const filter = () => {
        db.collection("offers").where("experienceLevel", "==", "Ekspertas").where("price", "==", "15").get()
            .then((querySnapshot) => {
                console.log(querySnapshot.docs.length);
            })
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
                            <Button variant="outline-dark" onClick={filter}>Filtruoti pasiūlymus</Button>
                        </div>

                    </Form.Group>

                </div>
                <div style={{display: "flex"}}>
                    {
                        items.map((item) => {
                            return (
                                    <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                        <Card.Img variant="top" src={item.profileImage} />
                                        <Card.Body>
                                            <Card.Title>{item.title}</Card.Title>
                                            <Card.Text>
                                                {
                                                    item.description.length >= 100 ? <div>{item.description.slice(0, 100)}...</div> : <div>{item.description}</div>
                                                }
                                            </Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroupItem>{item.nameAndSurname} {item.userRating}<Image style={{marginLeft: "1px"}} src={star} fluid/></ListGroupItem>
                                            <ListGroupItem>Patirtis: {item.experienceLevel}</ListGroupItem>
                                            <ListGroupItem>{item.price}€/val</ListGroupItem>
                                            <ListGroupItem>{item.phoneNumber}</ListGroupItem>
                                            <ListGroupItem>{item.location}</ListGroupItem>
                                        </ListGroup>
                                        <Card.Body>
                                            <div>
                                                <Button variant="outline-dark" onClick={() => handleModalShow(item)}>Peržiūrėti visą informaciją</Button>
                                                <UserOfferModalComponent show={modalShow} onHide={() => handleModalShow(item)} />
                                            </div>
                                            <div style={{marginTop: "2rem"}}>
                                                <Card.Link href={`mailto:${item.email}`}>Susiekti el. paštu</Card.Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
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

export default UserOffersViewComponent;