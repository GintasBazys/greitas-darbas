import React from "react";
import {Alert} from "react-bootstrap";

const ModalNotificationComponent = ({message} : { message: string}) => {
    if (message === "") {
        return null;
    }

    return (
        <div>
            <Alert variant="danger">{message}</Alert>
        </div>
    )
}

export default ModalNotificationComponent;