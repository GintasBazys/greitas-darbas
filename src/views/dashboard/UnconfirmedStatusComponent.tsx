import React from "react";
import {logout} from "../../features/user/userSlice";
import {Button} from "react-bootstrap";
import {useDispatch} from "react-redux";
import history from "../../history";

const UnconfirmedStatusComponent = () => {

    const dispatch = useDispatch();

    window.addEventListener('popstate', function(event) {
        history.go(1);
    });

    return (
        <div className="center">
            <h1>Paskyra dar nepatvirtinta administratoriaus. Prašome kantrybės.</h1>
            <Button variant="outline-warning" className="btn-lg" onClick={() => dispatch(logout())}>Atsijungti</Button>
        </div>
    )
}

export default UnconfirmedStatusComponent;