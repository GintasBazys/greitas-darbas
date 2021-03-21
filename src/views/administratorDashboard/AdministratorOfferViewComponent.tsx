import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import {Button, Image} from "react-bootstrap";
import AdministratorOfferModalComponent from "./AdministratorOfferModalComponent";
import star from "../../assets/star.svg";
import {Link} from "react-router-dom";

const AdministratorOfferViewComponent = () => {

    const image = useSelector(selectWorkerImage);

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db.collection("offers").orderBy("user").orderBy("createdOn"), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }
    moment.locale("lt")

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div className="center">
                {
                    items.map((item) => {

                        return (
                            <React.Fragment>
                                {/*@ts-ignore*/}
                                {item.title} - {item.location}, paskelbta: {moment(item.createdOn).fromNow()} - <Link to={{pathname: "/naudotojas/kitas",  query:{user: item.username}}}>{item.username}</Link>  {item.userRating}<span style={{marginLeft: "5px"}}><Image fluid src={star} /></span> <Button variant="outline-dark" onClick={() => handleModalShow()}>Peržiūrėti visą informaciją</Button> <Button variant="outline-danger">Panaikinti pasiūlymą</Button>
                                <AdministratorOfferModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} />
                            </React.Fragment>

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

export default AdministratorOfferViewComponent;