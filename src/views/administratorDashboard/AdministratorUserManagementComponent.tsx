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
                    <Col md={2}>
                        <Image style={{marginTop: "2rem"}} fluid src={adminUserLink} alt="naudotojo valdymo nuotrauka po nuorodomis"></Image>
                    </Col>
                    <Col md={8}>

                        {
                              items.length === 0 ? <div></div> : items.map(item => {
                                return (
                                    <div style={{marginTop: "2rem"}}>
                                        <div style={{borderStyle: "solid"}}>
                                            <div style={{overflow: "overlay"}}>
                                                <p className="center-element">Vardas, Pavardė: {item.nameAndSurname}</p>
                                                <p className="center-element">Gimimo metai: {moment(item.dateOfBirth).format("YYYY-MM-DD")}</p>
                                                <p className="center-element">Telefono numeris: {item.phoneNumber}</p>
                                                <p className="center-element">Elektroninis paštas: {item.email}</p>
                                                <p className="center-element">Vietovė: {item.location}</p>
                                                <p className="center-element">Paslaugos tipas: {item.activity}</p>
                                                <p className="center-element">Patirtis: {item.experienceLevel}</p>
                                                <div className="center-element">
                                                    <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => confirmStatus(item)}>Patvirtinti</Button>
                                                    <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => denyStatus(item)}>Atmesti prašymą</Button>
                                                    <a href={`mailto:${item.email}`} className="btn btn-primary">Susisiekti</a>
                                                </div>

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
                    <Col md={2}>
                        <Image style={{marginTop: "2rem"}} fluid src={userControlImage} alt="vartotojo valdymo puslapio nuotrauka"></Image>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdministratorUserManagementComponent;