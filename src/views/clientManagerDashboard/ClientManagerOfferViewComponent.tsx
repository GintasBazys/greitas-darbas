import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import {usePagination} from "use-pagination-firestore";
import {db, storageRef} from "../../firebase";
import {Button, Container, Image, Table} from "react-bootstrap";
import AdministratorOfferModalComponent from "../administratorDashboard/AdministratorOfferModalComponent";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import ClientManagerNavbarComponent from "./ClientManagerNavbarComponent";
import store from "../../app/store";
import {setOffer} from "../../features/offers/offersSlice";


const ClientManagerOfferViewComponent = () => {
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

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }
    moment.locale("lt")

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
            <ClientManagerNavbarComponent profileImage={image} />
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
                                            <th>Suk??rimo data</th>
                                            <th>Statusas</th>
                                            <th>El. pa??to adresas</th>
                                            <th>Telefono nr.</th>
                                            <th>Vietov??</th>
                                            <th>Kaina</th>
                                            <th>Informacijos per??i??ra</th>
                                            <th>Pasi??lymo panaikinimas</th>
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
                                                    <td><Button variant="outline-dark" onClick={() => handleModalShow()}>Per??i??r??ti informacij??</Button></td>
                                                    <td><Button variant="outline-danger" onClick={() => deleteOffer(item)}>Pa??alinti pasi??lym??</Button></td>
                                                    <td><AdministratorOfferModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} /></td>
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
                    items.length === 0 ? <div style={{marginTop: "2rem"}}>Daugiau skelbim?? n??ra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Gr????ti atgal</Button></div> :
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                }

            </div>
        </div>
    )
}

export default ClientManagerOfferViewComponent;