import React from "react";
import {Alert} from "react-bootstrap";

const NotificationComponent = ({message} : { message: string}) => {
    if (message === "") {
        return null;
    }

    return (
        <div>
            <Alert variant="danger">{message}</Alert>
        </div>
    )
}

export default NotificationComponent;