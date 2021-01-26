import React from "react"
import { Redirect, Route } from "react-router-dom"
import {auth} from "./firebase";

// @ts-ignore
const PrivateRoute = ({ component: Component, ...rest }) => {

    const isLoggedIn = auth.currentUser;

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/", }} />
                )
            }
        />
    )
}

export default PrivateRoute