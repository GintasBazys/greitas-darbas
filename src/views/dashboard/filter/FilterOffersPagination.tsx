import React, {useState} from "react";
import UserNavBarComponent from "../UserNavbarComponent";
import {Button, Card, Image, ListGroup, ListGroupItem} from "react-bootstrap";
import star from "../../../assets/star.svg";
import UserOfferModalComponent from "../UserOfferModalComponent";
import store from "../../../app/store";
import {setOffer} from "../../../features/offers/offersSlice";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import LoadingComponent from "../../LoadingComponent";
import {useSelector} from "react-redux";
import {selectImage} from "../../../features/user/userSlice";

interface Props {
    items: any,
    loading: any
}

const FilterOffersPagination = ({items, loading}: Props) => {

    const image = useSelector(selectImage);

    if(loading) {
        return <LoadingComponent />
    }

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
                        items.map((item: any) => {
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

            </div>
        </div>
    )
}
export default FilterOffersPagination