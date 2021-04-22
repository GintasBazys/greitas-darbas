import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {usePagination} from "use-pagination-firestore";
import {auth, db, storageRef} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import AdministratorOfferModalComponent from "./AdministratorOfferModalComponent";
import star from "../../assets/star.svg";
import {Link} from "react-router-dom";
import myOffersAndRequests from "../../assets/myoffersAndRequests.svg";
import OffersUpdateModalComponent from "../dashboard/OffersUpdateModalComponent";
import store from "../../app/store";
import {setOffer} from "../../features/offers/offersSlice";

const AdministratorOfferViewComponent = () => {

    const image = useSelector(selectWorkerImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("offers").orderBy("user").orderBy("createdOn"), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = async (item: any) => {
        await store.dispatch(setOffer(item));
        await setModalShow(!modalShow);

    }

    const deleteOffer = async (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            let titleForImages = "";
            await db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        titleForImages = doc.data()?.title;
                        db.collection("offers").doc(doc.id).delete();
                        const imagesRef = storageRef.child(`/${item.username}/pasiulymai/${titleForImages}/`);

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
    moment.locale("lt")

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div>
                {
                    items.map((item) => (

                        <div style={{marginLeft: "20rem", width: "70%"}}>
                            <div style={{marginTop: "2rem", border: "1px solid grey", marginBottom: "2rem"}}>
                                <div>
                                    <Container fluid>
                                        <Row>
                                            <Col md={9}>
                                                <div>
                                                    {item.title} - sukurta {moment(item.createdOn).fromNow()}
                                                </div>
                                                {
                                                    item.status === "rezervuotas" ?
                                                        <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                                            Paslauga yra rezervuota
                                                        </div> : <div></div>
                                                }
                                                {
                                                    item.status !== "naujas" && item.status !== "rezervuotas" ?
                                                        <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                                            Paslauga yra vykdoma
                                                        </div> : <div></div>
                                                }
                                                <div>
                                                    <p>Vietovė: {item.location}</p>
                                                    <p>Telefono nr. {item.phoneNumber}</p>
                                                    <p>Kaina: {item.price} €</p>
                                                </div>
                                                <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => handleModalShow(item)}>Peržiūrėti informaciją</Button>
                                                <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteOffer(item)}>Pašalinti pasiūlymą</Button>
                                            </Col>
                                            <Col md={3}>
                                                <Image src={myOffersAndRequests} fluid />
                                            </Col>
                                        </Row>
                                    </Container>

                                </div>
                            </div>

                            <AdministratorOfferModalComponent show={modalShow} onHide={() => handleModalShow(item)} item={item} />
                        </div>
                    ))
                }

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

export default AdministratorOfferViewComponent;