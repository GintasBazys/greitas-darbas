import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import ClientManagerNavbarComponent from "./ClientManagerNavbarComponent";
import {db} from "../../firebase";

const ClientManagerComponent = () => {
    const image = useSelector(selectWorkerImage);

    const [offers, setOffers] = useState(0);
    const [requests, setRequests] = useState(0);

    useEffect(() => {
        db.collection("offers").get()
            .then((querySnapshot) => {
                setOffers(querySnapshot.docs.length);
            })
    }, []);

    useEffect(() => {
        db.collection("requests").get()
            .then((querySnapshot) => {
                setRequests(querySnapshot.docs.length);
            })
    }, []);

    return (
        <div>
            <ClientManagerNavbarComponent profileImage={image} />
            <div className="center">
                <h1>Bendras paslaugų kiekis: {offers}</h1>
                <h1>Darbo pasiūlymų kiekis: {requests}</h1>
            </div>
        </div>
    )
}

export default ClientManagerComponent;