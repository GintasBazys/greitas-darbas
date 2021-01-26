import React from 'react';
import history from "./history";
import "./styles/app.scss"
import {Switch, Route, Router} from "react-router-dom";
import HomeComponent from "./views/main_page/HomeComponent";
import PrivateRoute from "./PrivateRoute";
import Login from "./features/user/Login";

function App() {
  return <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/login" component={Login} />
    </Switch>
  </Router>
}

export default App;
