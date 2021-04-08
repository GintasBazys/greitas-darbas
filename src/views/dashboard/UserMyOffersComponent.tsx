import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage, selectUser} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col} from "react-bootstrap";
import LoadingComponent from "../LoadingComponent";
import {usePagination} from "use-pagination-firestore";
import {db, storageRef} from "../../firebase";
import OffersUpdateModalComponent from "./OffersUpdateModalComponent";

const UserMyOffersComponent = () => {

    const image = useSelector(selectImage);
    const username = useSelector(selectUser);

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("offers").orderBy("createdOn", "desc").where("username", "==", username), {
            limit: 20
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const updateOffer = (item: any) => {
        setModalShow(!modalShow)
    }
    const deleteOffer = async (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            let titleForImages = "";
            await db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        titleForImages = doc.data()?.title;
                        db.collection("offers").doc(doc.id).delete()
                        const imagesRef = storageRef.child(`/${username}/pasiulymai/${titleForImages}/`);

                        imagesRef.listAll().then((result) => {
                            result.items.forEach((file) => {
                                file.delete()
                                    .then(() => {

                                    }).catch((error) => {
                                    console.log(error.message);
                                });
                            })
                        })
                        //db.collection("users").doc()
                    })
                })
            //history.go(0);
        }
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div>
                        <div>
                            {
                                 items.length === 0 ? <div></div> : isLoading? <LoadingComponent /> : items.map((item) => (
                                     <div style={{marginLeft: "20rem",borderStyle: "solid", width: "70%"}}>
                                        <div className="center-element" style={{marginTop: "2rem", marginBottom: "2rem"}}>
                                            {item.title}
                                            <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => updateOffer(item)}>Atnaujinti informaciją</Button>
                                            <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteOffer(item)}>Pašalinti pasiūlymą</Button>
                                        </div>

                                        <OffersUpdateModalComponent show={modalShow} item={item} onHide={() => updateOffer(item)} />
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
        </div>
    )
}

export default UserMyOffersComponent;