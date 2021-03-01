import React from "react";
import {Button} from "react-bootstrap";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import LoadingComponent from "../LoadingComponent";
import axios from "axios";

interface props {
    employees: boolean,
    setEmployees: any
}

const EmployeeListComponent = ({employees, setEmployees}: props) => {

    const handleHideEmployeeList = () => {
        setEmployees(!employees)
    }

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("workers"), {
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

    moment.locale("lt");

    return (
        <div>
            <div>
                {
                    isLoading ? <LoadingComponent /> : items.map((item) => {
                        return (
                            <div style={{marginTop: "2rem"}}>
                                <p>{item.email} - pradėjo dirbti {moment(item.createdOn).fromNow()}
                                    {item.status === "darbuotojas" ? <Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => removeWorkerAccount(item)}>Panaikinti darbuotojo paskyrą</Button> : <div></div>}
                                </p>
                            </div>
                        )
                    })
                }

                <Button style={{marginTop: "2rem"}} variant="outline-dark" type="submit" onClick={() => handleHideEmployeeList()}>
                    Slėpti darbuotojų sąrašą
                </Button>
            </div>
            <div className="center-element" style={{marginTop: "2rem"}}>
                <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
            </div>
        </div>
    )
}
export default EmployeeListComponent;