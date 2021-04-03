import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import {db} from "../../firebase";

const AdministratorDashboardComponent = () => {

    let image = useSelector(selectWorkerImage);

    const [unconfirmedUsers, setUnconfirmedUsers] = useState(0);
    const [workers, setWorkers] = useState(0);

    useEffect(() => {
        db.collection("users").where("status", "==", "nepatvirtintas").get()
            .then((querySnapshot) => {
                setUnconfirmedUsers(querySnapshot.docs.length);
            })
    }, []);
    useEffect(() => {
        db.collection("workers").where("status", "==", "darbuotojas").get()
            .then((querySnapshot) => {
                setWorkers(querySnapshot.docs.length);
            })
    }, []);

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div className="center">
                <h1>Paskyrų nepatvirtinta: {unconfirmedUsers}</h1>
                <h1>Darbuotojų kiekis: {workers}</h1>
            </div>
        </div>
    )
}

export default AdministratorDashboardComponent;