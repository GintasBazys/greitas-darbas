import React from "react";
import { Route, Redirect } from "react-router-dom";
// @ts-ignore
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props: any) => (false ? <Component {...props} /> : <Redirect to="/" />)}
    />
);

export default PrivateRoute;