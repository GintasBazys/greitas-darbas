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
import AdministratorUserManagementComponent from "./views/administratorDashboard/AdministratorUserManagementComponent";
import AdministratorWorkerManagementComponent
  from "./views/administratorDashboard/AdministratorWorkerManagementComponent";
import WorkerLogin from "./features/worker/WorkerLogin";
import AdministratorPaymentComponent from "./views/administratorDashboard/AdministratorPaymentComponent";
import MainUserComponent from "./views/dashboard/MainUserComponent";
import UserProfileComponent from "./views/dashboard/UserProfileComponent";
import UserWorkOfferManagementComponent from "./views/dashboard/UserWorkOfferManagementComponent";
import UserOffersViewComponent from "./views/dashboard/UserOffersViewComponent";
import UserPaymentComponent from "./views/dashboard/UserPaymentComponent";
import UserWorkforceSearchComponent from "./views/dashboard/UserWorkforceSearchComponent";
import UserUnconfirmedProfileComponent from "./views/dashboard/UserUnconfirmedProfileComponent";
import UserOffersInProgressComponent from "./views/dashboard/UserOffersInProgressComponent";
import UserMessagesComponent from "./views/dashboard/UserMessagesComponent";
import AdministratorOfferViewComponent from "./views/administratorDashboard/AdministratorOfferViewComponent";
import AdministratorUserViewProfileComponent from "./views/administratorDashboard/AdministratorUserViewProfileComponent";
import AdministratorUserMessages from "./views/administratorDashboard/AdministratorUserMessages";
import UserProfileViewComponent from "./views/dashboard/UserViewProfileComponent";
import OfferPaidComponent from "./views/dashboard/OfferPaidComponent";
import ServiceProviderOfferPaidComponent from "./views/dashboard/ServiceProviderOfferPaidComponent";
import AdministratorStatisticsComponent from "./views/administratorDashboard/AdministratorStatisticsComponent";
import UserSearchWorkerFormComponent from "./views/dashboard/UserSearchWorkerFormComponent";
import UserWorkforceViewComponent from "./views/dashboard/UserWorkforceViewComponent";
import UserRequestsInProgressComponent from "./views/dashboard/UserRequestsInProgressComponent";

function App() {
  return <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/prisijungti" component={Login} />
      <Route path="/darbuotojas/prisijungimas" component={WorkerLogin} />
      <PrivateRoute exact path="/pradzia" component={DashboardComponent} />
      <PrivateRoute exact path="/pradzia/profilis" component={UserUnconfirmedProfileComponent} />
      <PrivateRoute exact path="/nepatvirtintas" component={UnconfirmedStatusComponent} />
      <PrivateRoute exact path="/administracija" component={AdministratorDashboardComponent} />
      <PrivateRoute exact path="/administracija/profilis" component={AdministratorProfileComponent} />
      <PrivateRoute exact path="/administracija/paslauga" component={AdministratorOfferViewComponent} />
      <PrivateRoute exact path="/administracija/naudotojai" component={AdministratorUserManagementComponent} />
      <PrivateRoute exact path="/administracija/darbuotojai" component={AdministratorWorkerManagementComponent} />
      <PrivateRoute exact path="/administracija/mokejimai" component={AdministratorPaymentComponent} />
      <PrivateRoute exact path="/administracija/statstika" component={AdministratorStatisticsComponent} />
      <PrivateRoute exact path="/kitas" component={UserProfileViewComponent}/>
      <PrivateRoute exact path="/naudotojas/kitas" component={AdministratorUserViewProfileComponent} />
      <PrivateRoute exact path="/administracija/zinutes" component={AdministratorUserMessages} />
      <PrivateRoute exact path="/pagrindinis" component={MainUserComponent} />
      <PrivateRoute exact path="/profilis" component={UserProfileComponent} />
      <PrivateRoute exact path="/siulymas" component={UserWorkOfferManagementComponent} />
      <PrivateRoute exact path="/paslauga" component={UserOffersViewComponent} />
      <PrivateRoute exact path="/mokejimai" component={UserPaymentComponent} />
      <PrivateRoute exact path="/paieska" component={UserWorkforceSearchComponent} />
      <PrivateRoute exact path="/paieska/siulymai" component={UserWorkforceViewComponent} />
      <PrivateRoute exact path="/paieska/kurimas" component={UserSearchWorkerFormComponent} />
      <PrivateRoute exact path="/vykdymas" component={UserOffersInProgressComponent} />
      <PrivateRoute exact path="/darbai" component={UserRequestsInProgressComponent} />
      <PrivateRoute exact path="/zinutes" component={UserMessagesComponent} />
      <PrivateRoute exact path="/vykdymas/progresas" component={OfferPaidComponent} />
      <PrivateRoute exact path="/vykdymas/teikejas" component={ServiceProviderOfferPaidComponent} />
    </Switch>
  </Router>
}

export default App;
