import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Button, Image} from "react-bootstrap";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import {Link} from "react-router-dom";
import star from "../../assets/star.svg";
import UserOfferModalComponent from "./UserOfferModalComponent";
import history from "../../history";

const UserOffersViewComponent = () => {

    const image = useSelector(selectImage);
    //.where("status", "==", "naujas").where("status", "==", "atnaujintas")


    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("offers").orderBy("user").where("user", "!=", auth.currentUser?.uid).orderBy("createdOn").where("status", "==", "naujas"), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    const reserveOffer = async (item: { title: string; }) => {

        const confirm = window.confirm("Patvirtinti rezervaciją?");
        if(confirm) {
            let docId = ""
            await db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        docId = doc.id;
                    })
                })
            await db.collection("offers").doc(docId).update({
                status: "reservuotas",
                reservedUser: auth.currentUser?.uid
            })
            await history.go(0);
        }

    }

    moment.locale("lt")
    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div className="center">
                {
                    items.map((item) => {
                        return (
                            <div>
                                {/*@ts-ignore*/}
                                {item.title} - {item.location}, paskelbta: {moment(item.createdOn).fromNow()} - <Link to={{pathname: "/kitas",  query:{user: item.user}}}>{item.username}</Link>  {item.userRating}<span style={{marginLeft: "5px"}}><Image fluid src={star} /></span>
                                <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => handleModalShow()}>Peržiūrėti informaciją</Button>
                                <Button onClick={() => reserveOffer(item)} variant="outline-dark">Rezervuoti</Button>
                                <UserOfferModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} />
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

export default UserOffersViewComponent;