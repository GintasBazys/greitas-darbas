import React, {useEffect, useState} from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage, selectUserEmail} from "../../features/user/userSlice";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import * as firebase from "../../firebase";

const UserMessagesComponent = () => {

    const image = useSelector(selectImage);

    const userEmail = useSelector(selectUserEmail);
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);

   useEffect(() => {
       db.collection("users").doc(auth.currentUser?.uid).get()
           .then((doc) => {
               setSentMessages(doc.data()?.sentMessages);
               setReceivedMessages(doc.data()?.receivedMessages)
           })
   }, [])

    const sendMessage = async (message: any) => {
        const response = window.confirm("Išsiųsti žinutę?");
        if (response) {
            let messages: any[] = [];


            // await firebase.usersCollection.doc(props.user).get()
            //     .then((doc) => {
            //         messages = doc.data()?.receivedMessages
            //     });
            //
            // await firebase.usersCollection.doc(props.user).update({
            //     receivedMessages: [`${message} - ${workerEmail}`, ...messages]
            // })
            //
            // await firebase.usersCollection.doc(auth.currentUser?.uid).get()
            //     .then((doc) => {
            //         sentMessages = doc.data()?.sentMessages
            //     });
            //
            // await firebase.usersCollection.doc(auth.currentUser?.uid).update({
            //     sentMessages: [`${message} - ${props.email}`, ...sentMessages]
            // })
        }
    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            {
                <React.Fragment>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{marginTop: "2rem", width: "50%", borderStyle: "solid", borderRadius: "1rem"}}>
                            <div className="center-element">
                                <h1>Išsiųstos žinutės</h1>
                            </div>
                            <div>
                                {
                                    sentMessages.map((message: any) => (
                                            <h6 className="center-element">{message?.message} - {message?.receiver}</h6>
                                    ))
                                }
                            </div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Button style={{marginRight: "2rem"}} variant="outline-dark">Peržiūrėti visas
                                    žinutes</Button>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            }
            {
                <React.Fragment>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div style={{marginTop: "2rem", width: "50%", borderStyle: "solid", borderRadius: "1rem"}}>
                            <div className="center-element">
                                <h1>Gautos žinutės</h1>
                                {/*{*/}
                                {/*    receivedMessages.map((message: React.ReactNode) => {*/}
                                {/*        return <div className="center-element">{message}</div>*/}
                                {/*    })*/}
                                {/*}*/}
                            </div>
                            <div className="center-element">
                                {/*{*/}
                                {/*    receivedMessages.map((message: React.ReactNode) => (*/}
                                {/*        <React.Fragment>*/}
                                {/*            <h6>{message}</h6>*/}
                                {/*            <Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => sendMessage(message)}>Siųsti atsakymą</Button>*/}
                                {/*        </React.Fragment>*/}
                                {/*    ))*/}
                                {/*}*/}

                            </div>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                <Button style={{marginRight: "2rem"}} variant="outline-dark">Peržiūrėti visas
                                    žinutes</Button>
                                </div>
                        </div>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}

export default UserMessagesComponent;