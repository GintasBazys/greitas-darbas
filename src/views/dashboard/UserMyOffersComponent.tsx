import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage, selectUser} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, ListGroupItem, Row, Image} from "react-bootstrap";
import LoadingComponent from "../LoadingComponent";
import {usePagination} from "use-pagination-firestore";
import {db, storageRef} from "../../firebase";
import OffersUpdateModalComponent from "./OffersUpdateModalComponent";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import myOffersAndRequests from "../../assets/myoffersAndRequests.svg";

const UserMyOffersComponent = () => {

    const image = useSelector(selectImage);
    const username = useSelector(selectUser);

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("offers").orderBy("createdOn", "desc").where("username", "==", username).where("status", "==", "naujas"), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const updateOffer = (item: any) => {
        setModalShow(!modalShow)
    }
    const deleteOffer = async (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            let titleForImages = "";
            await db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        titleForImages = doc.data()?.title;
                        db.collection("offers").doc(doc.id).delete()
                        const imagesRef = storageRef.child(`/${username}/pasiulymai/${titleForImages}/`);

                        imagesRef.listAll().then((result) => {
                            result.items.forEach((file) => {
                                file.delete()
                                    .then(() => {

                                    }).catch((error) => {
                                    console.log(error.message);
                                });
                            })
                        })
                        //db.collection("users").doc()
                    })
                })
            //history.go(0);
        }
    }
    moment.locale("lt");

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div>
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
                                                                <p>Kaina: {item.price} €</p>
                                                            </div>
                                                            <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => updateOffer(item)}>Atnaujinti informaciją</Button>
                                                            <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteOffer(item)}>Pašalinti pasiūlymą</Button>
                                                        </Col>
                                                        <Col md={3}>
                                                            <Image src={myOffersAndRequests} fluid />
                                                        </Col>
                                                    </Row>
                                                </Container>

                                            </div>
                                        </div>

                                        <OffersUpdateModalComponent show={modalShow} item={item} onHide={() => updateOffer(item)} />
                                    </div>
                                ))
                            }
                            {
                                items.length === 0 ? <div style={{marginTop: "2rem"}} className="center-element">Nėra sukurtų pasiūlymų <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                                    <div>
                                        <div className="center-element" style={{marginTop: "2rem"}}>
                                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                                        </div>
                                        <div className="alert alert-warning center-element" role="alert" style={{ marginLeft: "450px", marginTop: "2rem", width: "50%"}}>
                                            Matysite tik šiuo metu nevykdomus skelbimus
                                        </div>
                                    </div>

                            }
                        </div>
            </div>
        </div>
    )
}

export default UserMyOffersComponent;