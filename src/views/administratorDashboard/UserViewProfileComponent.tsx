import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import { useHistory } from "react-router-dom";
import * as firebase from "../../firebase";
import {auth} from "../../firebase";
import {selectUser} from "../../features/user/userSlice";
import {Form} from "react-bootstrap";

const UserViewProfileComponent = () => {

    const image = useSelector(selectWorkerImage);

    const history = useHistory();
    // @ts-ignore
    console.log(history.location.query.user);

    const [portfolioImages, setPortfolioImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [username, setUsername] = useState("");

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
                    setPortfolioImages(doc.data()?.portfolioImages)
                })

            })
        setLoading(false);
    }, [])
    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            {email} {aboutMe} {username} {portfolioImages}
        </div>
    )
}

export default UserViewProfileComponent;