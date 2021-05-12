import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../../features/user/userSlice";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../../firebase";
import store from "../../../app/store";
import {setOffer} from "../../../features/offers/offersSlice";
import UserNavBarComponent from "../UserNavbarComponent";
import {Button, Card, Image, ListGroup, ListGroupItem} from "react-bootstrap";
import star from "../../../assets/star.svg";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import {selectSearch} from "../../../features/filter/offersInProgressFilterSlice";
import UserRequestModalComponent from "../UserRequestModalComponent";

const SearchWorkComponent = () => {
    const image = useSelector(selectImage);
    const search = useSelector(selectSearch);
    console.log(search);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("requests").where("status", "==", "naujas").where("title", ">=", search).where("title", "<=", search+ "\uf8ff"), {
            limit: 5
        }
    );
    console.log(items);

    const [modalShow, setModalShow] = useState(false);
    const handleModalShow = async (item: any) => {
        await store.dispatch(setOffer(item));
        await setModalShow(!modalShow);

    }

    moment.locale("lt")
    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div>
                <div style={{display: "flex"}}>
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

export default SearchWorkComponent;