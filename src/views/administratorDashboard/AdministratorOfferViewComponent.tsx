import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {usePagination} from "use-pagination-firestore";
import {db, storageRef} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import {Button, Col, Container, Image, Row, Table} from "react-bootstrap";
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
                    })
                })
        }
    }
    moment.locale("lt")

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div>
                {
                    <Container  style={{width: "80%"}} fluid>
                        <div style={{width: "100%"}}>
                            <div style={{marginTop: "2rem", border: "1px solid grey", marginBottom: "2rem"}}>
                                <div>

                                    <Table striped bordered hover responsive>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Pavadinimas</th>
                                            <th>Sukūrimo data</th>
                                            <th>Statusas</th>
                                            <th>El. pašto adresas</th>
                                            <th>Telefono nr.</th>
                                            <th>Vietovė</th>
                                            <th>Kaina</th>
                                            <th>Informacijos peržiūra</th>
                                            <th>Pasiūlymo panaikinimas</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.title}</td>
                                                    <td>{moment(item.createdOn).fromNow()}</td>
                                                    <td>
                                                        {
                                                            item.status === "rezervuotas" ?
                                                                <div>
                                                                    Paslauga yra rezervuota
                                                                </div> : <div></div>
                                                        }
                                                        {
                                                            item.status !== "naujas" && item.status !== "rezervuotas" ?
                                                                <div>
                                                                    Paslauga yra vykdoma
                                                                </div> : <div></div>
                                                        }
                                                        {
                                                            item.status === "naujas" ?
                                                                <div>
                                                                    Nevykdoma paslauga
                                                                </div> : <div></div>
                                                        }
                                                    </td>
                                                    <td>{item.userMail}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.price}</td>
                                                    <td><Button variant="outline-dark" onClick={() => handleModalShow(item)}>Peržiūrėti informaciją</Button></td>
                                                    <td><Button variant="outline-danger" onClick={() => deleteOffer(item)}>Pašalinti pasiūlymą</Button></td>
                                                    <td><AdministratorOfferModalComponent show={modalShow} onHide={() => handleModalShow(item)} item={item} /></td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </Container>

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