import React, {useState} from "react";
import {usePagination} from "use-pagination-firestore";
import {db, storageRef} from "../../firebase";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {useSelector} from "react-redux";
import {Button, Image, Container, Row, Col, Navbar} from "react-bootstrap";
import LoadingComponent from "../LoadingComponent";
import userControlImage from "../../assets/admin_user_control.svg";
import adminUserLink from "../../assets/admin_user_link.svg";
import {Link} from "react-router-dom";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import EmployeeListComponent from "./EmplyeeListComponent";
import UserListComponent from "./UserListComponent";

const AdministratorUserManagementComponent = () => {

    const image = useSelector(selectWorkerImage);

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("users").where("status", "==", "nepatvirtintas"), {
            limit: 10
        }
    );

    const confirmStatus = (item: any) =>{
        const response = window.confirm("Patvirtinti?");
        if(response) {
            db.collection("users").where("username", "==", item.username).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection("users").doc(doc.id).update({
                            status: "patvirtintas",
                            documentURLS: []
                        })
                    })
                    //db.collection("users").doc()
                })
            const imagesRef =  storageRef.child(`${item.username}/dokumentai/`);

            imagesRef.listAll().then((result) => {
                result.items.forEach((file) => {
                    file.delete()
                        .then(() => {

                        }).catch((error) => {
                        console.log(error.message);
                    });
                });
            }).catch((error) => {
                console.log(error.message);
            });

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
                            documentURLS: []
                        })
                    })
                    //db.collection("users").doc()
                })
            const imagesRef =  storageRef.child(`${item.username}/dokumentai/`);

            imagesRef.listAll().then((result) => {
                result.items.forEach((file) => {
                    file.delete()
                        .then(() => {

                        }).catch((error) => {
                        console.log(error.message);
                    });
                });
            }).catch((error) => {
                console.log(error.message);
            });

        }

    }

    const [usersList, setUsersList] = useState(false);

    const handleShowUsersList = () => {
        setUsersList(!usersList);
    }


    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <ul className="list-unstyled">
                            <li>Nuorodos</li>
                        </ul>
                        <ul>
                            <li><Link to="/administracija/naudotojai">Naudotojų valdymas</Link></li>
                            <li><Link to="/administracija/darbuotojai">Darbuotojų valdymas</Link></li>
                            <li><Link to="/administracija/pasiulymai">Darbo pasiūlymų peržiūra </Link></li>
                            <li><Link to="/administracija/mokejimai">Mokėjimų peržiūra </Link></li>
                        </ul>
                        <Image style={{marginTop: "2rem"}} fluid src={adminUserLink} alt="vartotojo valdymo nuotrauka po nuorodomis"></Image>
                    </Col>
                    <Col md={7}>

                        {
                            isLoading ? <LoadingComponent /> : items.map(item => {
                                return (
                                    <div className="center-element" style={{marginTop: "2rem"}}>
                                        <div style={{borderStyle: "dotted solid"}}>
                                            <div style={{overflow: "overlay"}}>

                                                <p>{item.username} - {item.email}</p>
                                                {
                                                    item.documentURLS.map((imageUrl: string, index: number) => {
                                                        return <a href={imageUrl} download target="_blank"><img  key={index} src={imageUrl} width="100px" height="100px" style={{marginLeft: "2rem"}}/></a>
                                                    })
                                                }
                                                <p>Norint peržiūrėti nuotrauką, paspausti tiesiogiai ant norimos nuotraukos</p>
                                                <div>
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

                        <div className="text-center">
                            <Button style={{marginTop: "2rem"}} variant="outline-dark" type="submit" onClick={() => handleShowUsersList()}>
                                Rodyti naudotoju sąrašą
                            </Button>
                        </div>
                        {
                            usersList ? <UserListComponent users={usersList} setUsers={setUsersList}/> : <div></div>
                        }

                    </Col>
                    <Col md={3}>
                        <Image style={{marginTop: "2rem"}} fluid src={userControlImage} alt="vartotojo valdymo puslapio nuotrauka"></Image>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdministratorUserManagementComponent;