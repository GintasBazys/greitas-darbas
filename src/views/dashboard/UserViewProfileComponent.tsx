import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import * as firebase from "../../firebase";
import {Button, Container, Image, Row} from "react-bootstrap";
import {selectImage, selectUserEmail} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";

const UserProfileViewComponent = () => {

    const image = useSelector(selectImage);

    const history = useHistory();
    // @ts-ignore
    console.log(history.location.query.user);

    const [portfolioImages, setPortfolioImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const userEmail = useSelector(selectUserEmail);
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [user, setUser] = useState("");


    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    useEffect(() => {

        setLoading(true);

        // @ts-ignore
        firebase.usersCollection.doc(history.location.query.user).get()
            .then((doc) => {
                    setEmail(doc.data()?.email);
                    setAboutMe(doc.data()?.aboutMe);
                    setUsername(doc.data()?.username);
                    setPortfolioImages(doc.data()?.portfolioImages);
                    setProfileImage(doc.data()?.image[0]);
                    setUser(doc.id);
            })
        setLoading(false);
    }, [])

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>

                <div style={{marginTop: "3rem", display: "flex", justifyContent: "center"}}>
                    <Image height="20%" width="20%" src={profileImage} fluid alt="profilis" />


                </div>
                <div style={{marginTop: "3rem", display: "flex", alignItems: "center", flexDirection: "column"}}>
                    <p>{email}</p>
                    <p>{aboutMe}</p>
                    <p>Darbų nuotraukos:</p>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {
                        portfolioImages === undefined ? <div>Daugiau nuotraukų nėra</div> :
                            portfolioImages.length <=9 ?
                                <div>
                                    {
                                        portfolioImages.map((portfolioImage) => {
                                            return <Image height="20%" width="20%" src={portfolioImage} fluid alt="darbu nuorauka" />
                                        })
                                    }
                                </div> :<div></div>
                    }
                </div>
                <div style={{marginTop: "3rem", display: "flex", justifyContent: "center"}}>
                    <Button variant="outline-dark" onClick={() => handleModalShow()}>Rašyti žinutę</Button>
                    <UserSendMessageModalComponent user={user} sender={userEmail} receiver={email} show={modalShow} onHide={() => handleModalShow()} />
                    <Button style={{marginLeft: "3rem"}} variant="outline-dark">Susiekti el. paštu</Button>
                </div>
            </Container>
        </div>
    )
}

export default UserProfileViewComponent;