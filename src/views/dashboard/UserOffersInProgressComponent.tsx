import React, {useState} from "react";
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
        db.collection("offers").where("status", "!=", "naujas"), {
            limit: 20
        }
    );

    // let query = db.collection("offers")
    // // @ts-ignore
    // query = query.where("status", "!=", "naujas")
    // // @ts-ignore
    // query = query.where("userMail", "==", "bazys.gintas@gmail.comm")
    // // @ts-ignore
    // query = query.orderBy("status")
    // query.get()
    //     .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             console.log(doc.id)
    //         })
    //     })

    const [modalShow, setModalShow] = useState(false);
    const [paymentModalShow, setPaymentModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow);
    }

    const handlePaymentModalShow = () => {
        setPaymentModalShow(!paymentModalShow);
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
                                    {item.title} - {item.location}, paskelbta: {moment(item.createdOn).fromNow()}, mokėjimas: {item.paymentStatus} - <Link to={{pathname: "/kitas",  query:{user: item.username}}}>{item.username}</Link>  {item.userRating}<span style={{marginLeft: "5px"}}><Image fluid src={star} /></span>
                                    {
                                        item.status === "rezervuotas" && item.reservedUser === auth.currentUser?.uid  ? <div className="alert alert-warning" role="alert"><p>Laukite patvirtinimo, prieš atlikdami mokėjimą</p><Button variant="outline-danger">Atšaukti rezervaciją</Button></div> :
                                            item.status !== "patvirtintasTeikejo" && item.status !== "Mokėjimas atliktas" && item.reservedUser !== auth.currentUser?.uid && item.user === auth.currentUser?.uid  ?
                                            <div>
                                                <p>Patvirkinkite paslaugos teikimą</p>
                                                <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => handleModalShow()}>Patvirtinti prašymą</Button>
                                                <Button variant="outline-danger">Atšaukti rezervaciją</Button>
                                                <ComfirmReservationModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} />
                                            </div> : item.status === "patvirtintasTeikejo" && item.reservedUser === auth.currentUser?.uid ?
                                            <div>
                                                <p>Patvirtinkite rezervaciją ir atlikite mokėjimą</p>
                                                <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => handlePaymentModalShow()}>Peržiūrėti</Button>
                                                <PaymentModalComponent show={paymentModalShow} onHide={() => handlePaymentModalShow()} item={item} />
                                                <Button variant="outline-danger">Atšaukti rezervaciją</Button>
                                            {/*    @ts-ignore*/}
                                            </div> : item.status === "Mokėjimas atliktas" && item.reservedUser === auth.currentUser?.uid ? <div><Button variant="outline-dark" onClick={() => {store.dispatch(setReservedOffer(item)), history.push("/vykdymas/progresas")}}>Peržiūrėti progresą</Button></div>
                                                    :  item.status === "Mokėjimas atliktas" && item.reservedUser !== auth.currentUser?.uid && item.user === auth.currentUser?.uid ? <div><Button variant="outline-dark" onClick={() => history.push("/vykdymas/teikejas")}>Peržiūrėti progresą</Button></div>

                                        : <div className="alert alert-warning" role="alert">Laukite kol bus atliktas mokėjimas{console.log(auth.currentUser?.uid)}</div>
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