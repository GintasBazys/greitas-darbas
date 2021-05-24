import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import {Button, Container, Image, Table} from "react-bootstrap";
import AdministratorRequestModalComponent from "../administratorDashboard/AdministratorRequestModalComponent";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import ClientManagerNavbarComponent from "./ClientManagerNavbarComponent";

const ClientManagerRequestViewComponent = () => {
    const image = useSelector(selectWorkerImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("requests").orderBy("user").orderBy("createdOn"), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    const deleteRequest = async (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            await db.collection("requests").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection("requests").doc(doc.id).delete();
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

                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Pavadinimas</th>
                                            <th>Sukūrimo data</th>
                                            <th>Statusas</th>
                                            <th>El. pašto adresas</th>
                                            <th>Telefono nr.</th>
                                            <th>Vietovė</th>
                                            <th>Biudžetas</th>
                                            <th>Informacijos peržiūra</th>
                                            <th>Skelbimo panaikinimas</th>
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
                                                                    Darbas yra rezervuotas
                                                                </div> : <div></div>
                                                        }
                                                        {
                                                            item.status !== "naujas" && item.status !== "rezervuotas" ?
                                                                <div>
                                                                    Darbas yra vykdomas
                                                                </div> : <div></div>
                                                        }
                                                        {
                                                            item.status === "naujas" ?
                                                                <div>
                                                                    Naujas darbas
                                                                </div> : <div></div>
                                                        }
                                                    </td>
                                                    <td>{item.userMail}</td>
                                                    <td>{item.phoneNumber}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.budget}</td>
                                                    <td><Button variant="outline-dark" onClick={() => handleModalShow()}>Peržiūrėti informaciją</Button></td>
                                                    <td><Button onClick={() => deleteRequest(item)}>Pašalinti skelbimą</Button></td>
                                                    <td><AdministratorRequestModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} /></td>
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

export default ClientManagerRequestViewComponent;