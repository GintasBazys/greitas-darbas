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
import RequestPaymentModalComponent from "./RequestPaymentModalComponent";
import store from "../../app/store";
import {setReservedRequest} from "../../features/requests/requestsSlice";
import history from "../../history";


const UserRequestsInProgressComponent = () => {
    const image = useSelector(selectImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("requests").where("status", "!=", "naujas"), {
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
                                        item.status === "rezervuotas" && item.reservedUser === auth.currentUser?.uid ? <div className="alert alert-warning" role="alert"><p>Laukite patvirtinimo</p><Button variant="outline-danger">Atšaukti rezervaciją</Button></div> : <div></div>
                                    }
                                    {
                                        item.status === "rezervuotas" && item.user === auth.currentUser?.uid ?
                                            <div>

                                                <p>Patvirtinkite darbo pradžią ir atlikite mokėjimą</p>
                                                <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => handlePaymentModalShow()}>Patvirtinti darbo pasiūlymą</Button>
                                                <Button variant="outline-danger">Atšaukti rezervaciją</Button>
                                                <RequestPaymentModalComponent show={paymentModalShow} onHide={() => handlePaymentModalShow()} item={item} />

                                            </div> : <div></div>
                                    }
                                    {
                                        item.status === "patvirtintasTeikejo" && item.user === auth.currentUser?.uid ? <div className="alert alert-warning" role="alert">Laukite kol bus atliktas mokėjimas{console.log(auth.currentUser?.uid)}</div> : <div></div>
                                    }
                                    {
                                        item.status === "Mokėjimas atliktas" && item.reservedUser === auth.currentUser?.uid ?
                                            <div>
                                                <Button variant="outline-dark" onClick={() => {store.dispatch(setReservedRequest(item)), history.push("/darbas/vykdymas/progresas")}}>Peržiūrėti progresą</Button>
                                            </div> : <div></div>
                                    }
                                    {
                                        item.status === "Mokėjimas atliktas" && item.user === auth.currentUser?.uid ?
                                            <div>
                                                <Button variant="outline-dark" onClick={() => {store.dispatch(setReservedRequest(item)), history.push("/darbas/vykdymas/teikejas")}}>Peržiūrėti progresą</Button>
                                            </div> : <div></div>
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

export default UserRequestsInProgressComponent;