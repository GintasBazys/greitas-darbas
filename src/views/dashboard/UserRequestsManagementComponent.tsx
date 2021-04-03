import React, {useState} from "react";
import LoadingComponent from "../LoadingComponent";
import {Button} from "react-bootstrap";
import OffersUpdateModalComponent from "./OffersUpdateModalComponent";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import {useSelector} from "react-redux";
import {selectImage, selectUser} from "../../features/user/userSlice";
import RequestsUpdateModalComponent from "./RequestsUpdateModalComponent";
import UserNavBarComponent from "./UserNavbarComponent";

const UserRequestsManagementComponent = () => {

    const username = useSelector(selectUser);
    const image = useSelector(selectImage);

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("requests").orderBy("createdOn", "desc").where("username", "==", username), {
            limit: 10
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const updateRequest = (item: any) => {
        setModalShow(!modalShow)
    }

    const deleteRequest = async (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            let titleForImages = "";
            await db.collection("requests").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        titleForImages = doc.data()?.title;
                        db.collection("requests").doc(doc.id).delete()
                        //db.collection("users").doc()
                    })
                })
            //history.go(0);
        }
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div className="center">
                {
                    items.length === 0 ? <div></div> : isLoading? <LoadingComponent /> : items.map((item) => (
                        <div>
                            <div style={{marginTop: "2rem"}}>
                                {item.title}
                                <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => updateRequest(item)}>Atnaujinti informaciją</Button>
                                <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteRequest(item)}>Pašalinti darbo pasiūlymą</Button>
                            </div>

                            <RequestsUpdateModalComponent show={modalShow} item={item} onHide={() => updateRequest(item)} />
                        </div>
                    ))
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

export default UserRequestsManagementComponent;