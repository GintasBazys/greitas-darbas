import React, {useState} from "react";
import LoadingComponent from "../LoadingComponent";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import {useSelector} from "react-redux";
import {selectImage, selectUser} from "../../features/user/userSlice";
import RequestsUpdateModalComponent from "./RequestsUpdateModalComponent";
import UserNavBarComponent from "./UserNavbarComponent";
import myOffersAndRequests from "../../assets/myoffersAndRequests.svg";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

const UserRequestsManagementComponent = () => {

    const username = useSelector(selectUser);
    const image = useSelector(selectImage);

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("requests").orderBy("createdOn", "desc").where("username", "==", username).where("status", "==", "naujas"), {
            limit: 10
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const updateRequest = (item: any) => {
        setModalShow(!modalShow)
    }

    const deleteRequest = async (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            let titleForImages = "";
            await db.collection("requests").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        titleForImages = doc.data()?.title;
                        db.collection("requests").doc(doc.id).delete()
                        //db.collection("users").doc()
                    })
                })
            //history.go(0);
        }
    }


    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div>
                {
                    items.length === 0 ? <div></div> : isLoading? <LoadingComponent /> : items.map((item) => (
                        <div style={{marginLeft: "20rem", width: "70%"}}>
                            <div style={{marginTop: "2rem", border: "1px solid grey", marginBottom: "2rem"}}>
                                <div>
                                    <Container fluid>
                                        <Row>
                                            <Col md={9}>
                                                <div>
                                                    {item.title} - sukurta {moment(item.createdOn).fromNow()}
                                                </div>
                                                <div>
                                                    <p>Vietovė: {item.location}</p>
                                                    <p>Telefono nr. {item.phoneNumber}</p>
                                                    <p>Biudžetas: {item.budget} €</p>
                                                </div>
                                                <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => updateRequest(item)}>Atnaujinti informaciją</Button>
                                                <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteRequest(item)}>Pašalinti pasiūlymą</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Image src={myOffersAndRequests} fluid />
                                            </Col>
                                        </Row>
                                    </Container>

                                </div>
                            </div>

                            <RequestsUpdateModalComponent show={modalShow} item={item} onHide={() => updateRequest(item)} />
                        </div>
                    ))
                }
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

export default UserRequestsManagementComponent;