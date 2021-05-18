import React from "react";
import {logout} from "../../features/user/userSlice";
import {Button, Image} from "react-bootstrap";
import {useDispatch} from "react-redux";
import unconfirmedPhoto from "../../../src/assets/unconfirmedStatus.svg";

const UnconfirmedStatusComponent = () => {

    const dispatch = useDispatch();

    return (
        <div className="center">
            <Image src={unconfirmedPhoto} alt="nepatvirtinta"/>
            <h1>Paskyra dar nepatvirtinta administratoriaus. Prašome kantrybės.</h1>
            <Button variant="outline-warning" className="btn-lg" onClick={() => dispatch(logout())}>Atsijungti</Button>
        </div>
    )
}

export default UnconfirmedStatusComponent;