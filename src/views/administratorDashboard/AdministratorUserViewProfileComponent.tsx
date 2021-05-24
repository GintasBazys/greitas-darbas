import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import { useHistory } from "react-router-dom";
import * as firebase from "../../firebase";
import {Button, Container, Image, Row} from "react-bootstrap";

const AdministratorUserViewProfileComponent = () => {

    const image = useSelector(selectWorkerImage);

    const history = useHistory();
    // @ts-ignore
    console.log(history.location.query.user);

    const [portfolioImages, setPortfolioImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {

        setLoading(true);

        // @ts-ignore
        firebase.usersCollection.where("username", "==", history.location.query.user).limit(1).get()
            .then((querySnapshot) => {
                //@ts-ignore
                querySnapshot.forEach((doc) => {
                    setEmail(doc.data()?.email);
                    setAboutMe(doc.data()?.aboutMe);
                    setUsername(doc.data()?.username);
                    setPortfolioImages(doc.data()?.portfolioImages);
                    setProfileImage(doc.data()?.image);
                })

            })
        setLoading(false);
    }, [])
    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <Container fluid>

                        <div style={{marginTop: "3rem", display: "flex", justifyContent: "center"}}>
                            <Image height="20%" width="20%" src={profileImage} fluid alt="profilis" />


                        </div>
                <div style={{marginTop: "3rem", display: "flex", alignItems: "center", flexDirection: "column"}}>
                    <p>{username}</p>
                    <p>{email}</p>
                    <p>{aboutMe}</p>
                    <p>Darbų nuotraukos:</p>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    {
                        portfolioImages.map((portfolioImage) => {
                            return <Image height="20%" width="20%" src={portfolioImage} fluid alt="darbu nuorauka" />
                        })
                    }
                </div>
                <div style={{marginTop: "3rem", display: "flex", justifyContent: "center"}}>
                    <Button style={{marginLeft: "3rem"}} variant="outline-dark">Susiekti el. paštu</Button>
                </div>
            </Container>
        </div>
    )
}

export default AdministratorUserViewProfileComponent;