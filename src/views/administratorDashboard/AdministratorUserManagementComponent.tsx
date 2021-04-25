import React from "react";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {useSelector} from "react-redux";
import {Button, Image, Container, Row, Col, Navbar} from "react-bootstrap";
import LoadingComponent from "../LoadingComponent";
import userControlImage from "../../assets/admin_user_control.svg";
import adminUserLink from "../../assets/admin_user_link.svg";
import {selectWorkerImage} from "../../features/worker/workerSlice";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import myOffersAndRequests from "../../assets/myoffersAndRequests.svg";

const AdministratorUserManagementComponent = () => {

    const image = useSelector(selectWorkerImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("users").orderBy("username").where("status", "==", "nepatvirtintas_darbuotojas"), {
            limit: 10
        }
    );

    console.log(items)

    const confirmStatus = (item: any) =>{
        const response = window.confirm("Patvirtinti?");
        if(response) {
            db.collection("users").where("username", "==", item.username).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection("users").doc(doc.id).update({
                            status: "patvirtintas_darbuotojas",
                        })
                    })
                    //db.collection("users").doc()
                })
        }


    }

    const denyStatus = (item: any) =>{
        const response = window.confirm("Atmesti prašymą?");

        if(response) {
            db.collection("users").where("username", "==", item.username).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection("users").doc(doc.id).update({
                            status: "naujas",
                        })
                    })
                    //db.collection("users").doc()
                })
        }

    }

    moment.locale("lt");

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={12}>

                        {
                              items.length === 0 ? <div></div> : items.map(item => {
                                return (
                                    <div style={{width: "70%", marginLeft: "300px"}}>
                                        <div style={{marginTop: "2rem", border: "1px solid grey", marginBottom: "2rem", width: "70%"}}>
                                            <div className="center-element">
                                                <Container fluid>
                                                    <Row>
                                                        <Col md={9}>
                                                            <div>
                                                                <p>Vardas, Pavardė: {item.nameAndSurname}</p>
                                                                <p>Gimimo metai: {moment(item.dateOfBirth).format("YYYY-MM-DD")}</p>
                                                                <p>Telefono numeris: {item.phoneNumber}</p>
                                                                <p>Elektroninis paštas: {item.email}</p>
                                                                <p>Vietovė: {item.location}</p>
                                                                <p>Paslaugos tipas: {item.activity}</p>
                                                                <p>Patirtis: {item.experienceLevel}</p>
                                                            </div>
                                                            <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => confirmStatus(item)}>Patvirtinti</Button>
                                                            <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => denyStatus(item)}>Atmesti prašymą</Button>
                                                            <a href={`mailto:${item.email}`} className="btn btn-primary">Susisiekti</a>
                                                        </Col>
                                                        <Col md={3}>
                                                            <Image src={item.image} fluid />
                                                        </Col>
                                                    </Row>
                                                </Container>

                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdministratorUserManagementComponent;