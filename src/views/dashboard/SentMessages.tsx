import React from "react";
import {Card} from "react-bootstrap";
import mail from "../../assets/mail.svg";
import LoadingComponent from "../LoadingComponent";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

interface Props {
    items: any,
    loading: any
}

const SentMessages = ({items, loading}: Props) => {

    if(loading) {
        return <LoadingComponent />
    }
    moment.locale("lt");

    return (
        <div style={{display: "flex"}}>
            {
                items.slice(0, 10).map((message: any) => (
                    <div>
                        <Card style={{ width: '18rem', marginLeft: "5px"}}>
                            <Card.Img variant="top" src={mail} />
                            <Card.Body>
                                <Card.Title>{message.receiver}</Card.Title>
                                <Card.Title>{moment(message.createdOn).format("dddd, h:mm:ss")}</Card.Title>
                                <Card.Text>
                                    {message?.message}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>

                ))
            }
        </div>
    )
}

export default SentMessages;