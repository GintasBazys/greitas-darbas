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
import FilterOffersModalComponent from "./filter/FilterOffersModalComponent";
import {setFilteredSearch} from "../../features/filter/offersInProgressFilterSlice";

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

    const [filterModalShow, setFilterModalShow] = useState(false);

    const filter = () => {
        setFilterModalShow(!filterModalShow);
    }

    const [search, setSearch] = useState("");

    const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value);
    }

    const searchOffers = async () => {
        console.log(search);
        await store.dispatch(setFilteredSearch(search));
        await history.push("/paslauga/paieska");
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
                            <Button variant="outline-dark" style={{marginRight: "2rem"}} onClick={searchOffers}><Image src={searchIcon} fluid /> Ieškoti</Button>
                            <Button variant="outline-dark" onClick={filter}>Filtruoti pasiūlymus</Button>
                            <FilterOffersModalComponent show={filterModalShow} onHide={() => filter()} />
                        </div>

                    </Form.Group>

                </div>
                <div style={{display: "flex"}}>
                    {
                        items.map((item) => {
                            return (

                                    <Card style={{ marginLeft: "2rem", width: "18rem" }}>
                                        <Card.Img variant="top" src={item.profileImage} style={{maxWidth: "100%", height: "400px"}} />
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
                                                <Card.Link href={`mailto:${item.userMail}`}>Susiekti el. paštu</Card.Link>
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