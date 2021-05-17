import React, {useState} from "react";
import {Button, Card} from "react-bootstrap";
import mail from "../../assets/mail.svg";
import UserSendMessageModalComponent from "./UserSendMessageModalComponent";
import {useSelector} from "react-redux";
import LoadingComponent from "../LoadingComponent";
import {selectUserEmail} from "../../features/user/userSlice";
import {auth} from "../../firebase";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

interface Props {
    items: any,
    loading: any
}

const ReceivedMessages = ({items, loading}: Props) => {

    if(loading) {
        return <LoadingComponent />
    }

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    moment.locale("lt");

    const userEmail = useSelector(selectUserEmail);
    return (
        <div style={{display: "flex"}}>
            {
                items.slice(0, 10).map((message: any) => (
                    <div>
                        <Card style={{ width: '18rem', marginLeft: "5px"}}>
                            <Card.Img variant="top" src={mail} />
                            <Card.Body>
                                <Card.Title>{message.sender}</Card.Title>
                                <Card.Title>{moment(message.createdOn).format("dddd, h:mm:ss")}</Card.Title>
                                <Card.Text>
                                    {message?.message}
                                </Card.Text>
                                <Button style={{marginLeft: "2rem"}} variant="outline-dark" onClick={() => handleModalShow()}>Siųsti atsakymą</Button>
                                {/*@ts-ignore*/}
                                <UserSendMessageModalComponent show={modalShow} onHide={() => handleModalShow()} sender={userEmail} receiver={message.sender} user={auth.currentUser?.uid} />
                            </Card.Body>
                        </Card>
                    </div>

                ))
            }
        </div>
    )
}

export default ReceivedMessages;