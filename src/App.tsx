import React from 'react';
import history from "./history";
import "./styles/app.scss"
import {Switch, Route, Router} from "react-router-dom";
import HomeComponent from "./views/main_page/HomeComponent";
import PrivateRoute from "./PrivateRoute";
import Login from "./features/user/Login";
import DashboardComponent from "./views/dashboard/DashboardComponent";
import UnconfirmedStatusComponent from "./views/dashboard/UnconfirmedStatusComponent";
import AdministratorDashboardComponent from "./views/administratorDashboard/AdministratorDashboardComponent";
import AdministratorProfileComponent from "./views/administratorDashboard/AdministratorProfileComponent";

function App() {
  return <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/prisijungti" component={Login} />
      <PrivateRoute exact path="/pradzia" component={DashboardComponent} />
      <PrivateRoute exact path="/nepatvirtintas" component={UnconfirmedStatusComponent} />
      <PrivateRoute exact path="/administracija" component={AdministratorDashboardComponent} />
      <PrivateRoute exact path="/administracija/profilis" component={AdministratorProfileComponent} />
    </Switch>
  </Router>
}

export default App;
