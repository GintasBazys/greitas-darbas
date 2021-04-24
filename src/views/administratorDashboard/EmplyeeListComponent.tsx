import React from "react";
import {Button, Col, Container, Image, Row, Table} from "react-bootstrap";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import LoadingComponent from "../LoadingComponent";
import axios from "axios";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import worker from "../../assets/worker.svg";

interface props {
    employees: boolean,
    setEmployees: any
}

const EmployeeListComponent = ({employees, setEmployees}: props) => {

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("workers").orderBy("status"), {
            limit: 15
        }
    );

    const removeWorkerAccount = (item: { username: string; }) => {
        const confirm = window.confirm("Patvirtinti darbuotojo paskyros panaikinimą?");
        if(confirm) {
            db.collection("workers").where("username", "==", item.username).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const user = doc.id
                        db.collection("workers").doc(doc.id).delete()
                            .then(() => {
                                const response = axios.post(
                                    "http://localhost:8080/firebase/darbuotojai",
                                    {
                                        uid: user
                                    }
                                );
                            })
                    })
                })
        }

    }
    const image = useSelector(selectWorkerImage);

    moment.locale("lt");

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div style={{marginTop: "2rem"}}>
                {
                    isLoading ? <LoadingComponent /> :
                            <div style={{marginLeft: "20rem", width: "70%"}}>
                                <div style={{marginTop: "2rem", border: "1px solid grey", marginBottom: "2rem"}}>
                                    <div>
                                        <Container fluid>
                                            <Row>
                                                <Col md={12}>
                                                    <Table striped bordered hover>
                                                        <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Vardas ir pavardė</th>
                                                            <th>Pradėjo dirbti</th>
                                                            <th>Statusas</th>
                                                            <th>El. pašto adresas</th>
                                                            <th>Telefono nr.</th>
                                                            <th>Gvenamoji vieta</th>
                                                            <th>Paskyros panaikinimas</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            items.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.nameAndSurname}</td>
                                                                    <td>{moment(item.createdOn).fromNow()}</td>
                                                                    <td>{item.status}</td>
                                                                    <td>{item.email}</td>
                                                                    <td>{item.phoneNumber}</td>
                                                                    <td>{item.location}</td>
                                                                    <td>{item.status === "darbuotojas" ? <Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => removeWorkerAccount(item)}>Panaikinti darbuotojo paskyrą</Button> : <div></div>}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </div>
                            </div>
                }
            </div>
            <div className="center-element" style={{marginTop: "2rem"}}>
                <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
            </div>
        </div>
    )
}
export default EmployeeListComponent;