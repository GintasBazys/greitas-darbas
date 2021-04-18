import React, {useEffect, useState} from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage, selectUserEmail} from "../../features/user/userSlice";
import {auth, db} from "../../firebase";
import {Button, Card} from "react-bootstrap";
import mail from "../../assets/mail.svg";

const UserReceivedMessagesComponent = () => {

    const image = useSelector(selectImage);

    const userEmail = useSelector(selectUserEmail);
    const [sentMessages, setSentMessages] = useState([]);

    useEffect(() => {
        db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setSentMessages(doc.data()?.sentMessages)
            })
    }, [])

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            {
                <React.Fragment>
                    <div style={{display: "flex"}}>
                        {
                            sentMessages.slice(0, 10).map((message: any) => (
                                <div>
                                    <Card style={{ width: '18rem', marginLeft: "5px"}}>
                                        <Card.Img variant="top" src={mail} />
                                        <Card.Body>
                                            <Card.Title>{message.receiver}</Card.Title>
                                            <Card.Text>
                                                {message?.message}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>

                            ))
                        }
                    </div>
                    <div style={{display: "flex", marginTop: "2rem", justifyContent: "center"}}>
                        <Button variant="outline-dark">Peržiūrėti visas žinutes</Button>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}

export default UserReceivedMessagesComponent;