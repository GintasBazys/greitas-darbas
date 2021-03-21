import React from "react";
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
                                {item.title} - {item.location}, paskelbta: {moment(item.createdOn).fromNow()} - <Link to={{pathname: "/naudotojas/kitas",  query:{user: item.username}}}>{item.username}</Link>  {item.userRating}<span style={{marginLeft: "5px"}}><Image fluid src={star} /></span>  <Button variant="outline-dark">Rezervuoti</Button>
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