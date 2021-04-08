import React from "react";
import {Button} from "react-bootstrap";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import LoadingComponent from "../LoadingComponent";
import axios from "axios";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";

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
                    isLoading ? <LoadingComponent /> : items.map((item) => {
                        return (
                            <div style={{marginLeft: "20rem",borderStyle: "solid", width: "70%"}}>
                                <div className="center-element" style={{marginTop: "2rem"}}>
                                <p>{item.email} - pradėjo dirbti {moment(item.createdOn).fromNow()}
                                    {item.status === "darbuotojas" ? <Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => removeWorkerAccount(item)}>Panaikinti darbuotojo paskyrą</Button> : <div></div>}
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
export default EmployeeListComponent;