import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Link} from "react-router-dom";
import {Button, Image} from "react-bootstrap";
import star from "../../assets/star.svg";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import ComfirmReservationModalComponent from "./ComfirmReservationModalComponent";
import PaymentModalComponent from "./PaymentModalComponent";
import history from "../../history";
import store from "../../app/store";
import {setReservedOffer} from "../../features/offers/offersSlice";
import axios from "axios";

const UserOffersInProgressComponent = () => {
    const image = useSelector(selectImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("offers").orderBy("status").where("status", "!=", "naujas"), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);
    const [paymentModalShow, setPaymentModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow);
    }

    const handlePaymentModalShow = () => {
        setPaymentModalShow(!paymentModalShow);
    }

    const cancelReservationWithoutPay = async (item: any) => {
        const confirmation = window.confirm("Atšaukti rezervaciją");
        if (confirmation) {

            await db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        await db.collection("offers").doc(doc.id).update({
                            status: "Atšauktas nesumokėjus",
                        })

                        await history.go(0);
                    })
                })
        }
    }

    const initiateRefund = async (item: any) => {
        console.log(item.price);
        const confirmation = window.confirm(`Patvirtinti gražinimą? Suma: € ${item.price * item.timeForOffer}`);
        if (confirmation) {
            try {
                const response = await axios.post(
                    "http://localhost:8080/stripe/grazinimas",
                    {
                        id: item.paymentId,
                    }
                );
                console.log(response.data.success);
                if (response.data.success) {
                    await db.collection("offers").where("title", "==", item.title).limit(1).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach(async (doc) => {
                                await db.collection("offers").doc(doc.id).update({
                                    status: "naujas",
                                    reservedTimeDay: "",
                                    reservedTimeHour: "",
                                    reservedUser: "",
                                    reservedUserEmail: "",
                                    paymentId: "",
                                    paymentStatus: "",
                                    timeForOffer: ""
                                })
                                let progressRating = 0;

                                await db.collection("offerReview").doc(doc.id).get()
                                    .then((doc) => {
                                        progressRating = doc.data()?.progressRating;
                                    }).then(() => {
                                        db.collection("offerReview").doc(doc.id).delete()
                                    })
                                let rating: number = 0;
                                await db.collection("users").doc(item.user).get()
                                    .then((doc) => {
                                        let ratingCount: number = doc.data()?.ratingCount +1;
                                        rating = doc.data()?.rating;
                                        db.collection("users").doc(item.user).update({
                                            rating: rating + progressRating / ratingCount,
                                            ratingCount: ratingCount
                                        })
                                    })
                                await history.go(0);
                            })
                        })
                    //
                }

            } catch (e) {

            }
        }
    }

    const confirmCancelWithoutPay = async (item: any) => {
        await db.collection("offers").where("title", "==", item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach(async (doc) => {
                    await db.collection("offers").doc(doc.id).update({
                        status: "naujas",
                        reservedTimeDay: "",
                        reservedTimeHour: "",
                        reservedUser: "",
                        reservedUserEmail: "",
                        paymentId: "",
                        paymentStatus: "",
                        timeForOffer: ""
                    })
                    await history.go(0);
                })
            })
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div className="center">
                {
                    items.map((item) => {

                        return (
                            <div>
                                <div>
                                    {/*@ts-ignore*/}
                                    {item.title} - {item.location}, paskelbta: {moment(item.createdOn).fromNow()}, mokėjimas: {item.paymentStatus} - <Link to={{pathname: "/kitas",  query:{user: item.username}}}>{item.username}</Link>  {Math.round(item.userRating)}<span style={{marginLeft: "5px"}}><Image fluid src={star} /></span>
                                    {
                                        item.status === "rezervuotas" && item.reservedUser === auth.currentUser?.uid ? <div className="alert alert-warning" role="alert"><p>Laukite patvirtinimo, prieš atlikdami mokėjimą</p><Button variant="outline-danger" onClick={() => cancelReservationWithoutPay(item)}>Atšaukti rezervaciją</Button></div> : <div></div>
                                    }
                                    {
                                        item.status === "rezervuotas" && item.user === auth.currentUser?.uid ?
                                            <div>

                                                <p>Patvirkinkite paslaugos teikimą</p>
                                                <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => handleModalShow()}>Patvirtinti prašymą</Button>
                                                <Button variant="outline-danger">Atšaukti rezervaciją</Button>
                                                <ComfirmReservationModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} />

                                            </div> : <div></div>
                                    }
                                    {
                                        item.status === "patvirtintasTeikejo" && item.reservedUser === auth.currentUser?.uid ?
                                            <div className="alert alert-warning" role="alert">
                                                <p>Patvirtinkite rezervaciją ir atlikite mokėjimą</p>
                                                <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => handlePaymentModalShow()}>Peržiūrėti</Button>
                                                <PaymentModalComponent show={paymentModalShow} onHide={() => handlePaymentModalShow()} item={item} />
                                                <Button variant="outline-danger" onClick={cancelReservationWithoutPay}>Atšaukti rezervaciją</Button>
                                            </div> : <div></div>
                                    }
                                    {
                                        item.status === "patvirtintasTeikejo" && item.user === auth.currentUser?.uid ? <div className="alert alert-warning" role="alert">Laukite kol bus atliktas mokėjimas{console.log(auth.currentUser?.uid)}</div> : <div></div>
                                    }
                                    {
                                        (item.status === "Mokėjimas atliktas" || item.status === "Atšauktas naudotojo" || item.status === "Atšaukimas patvirtintas" || item.status === "Atliktas" || item.status === "Vykdomas" || item.status === "Atidėta") && item.reservedUser === auth.currentUser?.uid ?
                                            <div>
                                                <Button variant="outline-dark" onClick={() => {store.dispatch(setReservedOffer(item)), history.push("/vykdymas/progresas")}}>Peržiūrėti progresą</Button>
                                            </div> : <div></div>
                                    }
                                    {
                                        (item.status === "Mokėjimas atliktas" || item.status === "Atšauktas naudotojo" || item.status === "Atšaukimas patvirtintas" || item.status === "Atliktas" || item.status === "Atidėta") && item.user === auth.currentUser?.uid ?
                                            <div>
                                                <Button variant="outline-dark" onClick={() => {store.dispatch(setReservedOffer(item)), history.push("/vykdymas/teikejas")}}>Peržiūrėti progresą</Button>
                                            </div> : <div></div>
                                    }
                                    {
                                        item.paymentStatus === "Mokėjimas atliktas" && item.status === "Atšauktas teikėjo" && item.user === auth.currentUser?.uid ?
                                            <div className="alert alert-warning" role="alert">Laukite kol klientas patvirtins pinigų gražinimą</div> : <div></div>
                                    }
                                    {
                                        item.paymentStatus === "Mokėjimas atliktas" && item.status === "Atšauktas teikėjo" && item.reservedUser === auth.currentUser?.uid ?
                                            <div>
                                                <p>Patvirtinkite pinigų gražinimą</p>
                                                <Button variant="outline-dark" onClick={() =>initiateRefund(item)}>Patvirtinti gražinimą</Button>
                                            </div> : <div></div>
                                    }
                                    {
                                        item.status === "Atšauktas nesumokėjus" && item.reservedUser === auth.currentUser?.uid ?
                                            <div className="alert alert-warning" role="alert">Atšaukimo nepatvirtino paslaugos teikėjas</div> : <div></div>
                                    }
                                    {
                                        item.status === "Atšauktas nesumokėjus" && item.user === auth.currentUser?.uid ?
                                            <div><Button variant="outline-dark" onClick={() => confirmCancelWithoutPay(item)}>Patvirtinkite atšaukimą</Button></div> : <div></div>
                                    }


                                </div>
                            </div>
                        )
                    })
                }

                {
                    items.length === 0 ? <div style={{marginTop: "2rem"}}>Daugiau skelbimų nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                        </div>
                }

            </div>

        </div>
    )
}

export default UserOffersInProgressComponent;