import React from "react";
import {Button} from "react-bootstrap";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import LoadingComponent from "../LoadingComponent";
import axios from "axios";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";

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
            limit: 15
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
                    isLoading ? <LoadingComponent /> : items.map((item) => {
                        return (
                            <div style={{marginLeft: "20rem",borderStyle: "solid", width: "70%"}}>
                                <div className="center-element" style={{marginTop: "2rem"}}>
                                    <p>{item.email}, statusas: {item.status}
                                        <Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => removeUserAccount(item)}>Panaikinti naudotojo paskyrą</Button>
                                    </p>
                                </div>
                            </div>
                        )
                    })
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