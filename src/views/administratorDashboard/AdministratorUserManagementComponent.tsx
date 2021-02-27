import React, {useState} from "react";
import {usePagination} from "use-pagination-firestore";
import {db, storageRef} from "../../firebase";
import history from "../../history";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import {Button, ListGroup, Image} from "react-bootstrap";
import firebase from "firebase";

const AdministratorUserManagementComponent = () => {

    const image = useSelector(selectImage);

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

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <ListGroup as="ul" variant="flush">

            </ListGroup>
            {
                items.map(item => {
                    return (

                        <div style={{borderStyle: "dashed"}}>
                            <div style={{overflow: "overlay"}}>

                                <p>{item.username}</p>
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
                    )
                })
            }
            <Button disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>

            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
        </div>
    )
}

export default AdministratorUserManagementComponent;