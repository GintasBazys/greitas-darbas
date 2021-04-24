import React from "react";
import {Button, Col, Container, Image, Row, Table} from "react-bootstrap";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import LoadingComponent from "../LoadingComponent";
import axios from "axios";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import worker from "../../assets/worker.svg";

const UserListComponent = () => {

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("users").orderBy("username"), {
            limit: 25
        }
    );

    const image = useSelector(selectWorkerImage);

    const removeUserAccount = (item: { username: string; }) => {
        const confirm = window.confirm("Patvirtinti naudotojo paskyros panaikinimą?");
        if(confirm) {
            db.collection("users").where("username", "==", item.username).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const user = doc.id
                        db.collection("users").doc(doc.id).delete()
                            .then(() => {
                                const response = axios.post(
                                    "http://localhost:8080/firebase/naudotojai",
                                    {
                                        uid: user
                                    }
                                );
                            })
                    })
                })
        }

    }

    return (
        <div style={{marginTop: "2rem"}}>
            <AdministratorDashboardNavbar profileImage={image} />
            <div>
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
                                                                    <td>{item.email}</td>
                                                                    <td>{item.phoneNumber}</td>
                                                                    <td>{item.location}</td>
                                                                    <td><Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => removeUserAccount(item)}>Panaikinti naudotojo paskyrą</Button></td>
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
export default UserListComponent;