import React, {useEffect, useState} from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import {auth, db} from "../../firebase";

const MainUserComponent = () => {

    const image = useSelector(selectImage);

    const [offers, setOffers] = useState(0);
    const [requests, setRequests] = useState(0);
    const [offersInProgress, setOffersInProgress] = useState(0);
    const [requestsInProgress, setRequestsInProgress] = useState(0);

    useEffect(() => {
        db.collection("offers").where("status", "==", "naujas").get()
            .then((querySnapshot) => {
                setOffers(querySnapshot.docs.length)
            })
    }, [])
    useEffect(() => {
        db.collection("requests").where("status", "==", "naujas").get()
            .then((querySnapshot) => {
                setRequests(querySnapshot.docs.length)
            })
    }, [])

    useEffect(() => {
        db.collection("reservedOffers").where("reservedUser", "==", auth.currentUser?.uid).get()
            .then((querySnapshot) => {
                setOffersInProgress(querySnapshot.docs.length)
            })
    }, [])
    useEffect(() => {
        db.collection("requests").where("reservedUser", "==", auth.currentUser?.uid).get()
            .then((querySnapshot) => {
                setRequestsInProgress(querySnapshot.docs.length)
            })
    }, [])

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div className="center">
                <h1>Siūlomų paslaugų: {offers}</h1>
                <h1>Ieškomų darbuotojų: {requests}</h1>
                <h1>Vykdoma darbų: {requestsInProgress}</h1>
                <h1>Vykdoma paslaugų: {offersInProgress}</h1>
            </div>
            {/*<div style={{width: "20%"}}>*/}
            {/*    <Stripe />*/}
            {/*</div>*/}
        </div>
    )
}

export default MainUserComponent;