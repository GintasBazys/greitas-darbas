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
import UserProfileViewComponent from "./views/dashboard/UserViewProfileComponent";
import OfferPaidComponent from "./views/dashboard/OfferPaidComponent";
import ServiceProviderOfferPaidComponent from "./views/dashboard/ServiceProviderOfferPaidComponent";
import AdministratorStatisticsComponent from "./views/administratorDashboard/AdministratorStatisticsComponent";
import UserSearchWorkerFormComponent from "./views/dashboard/UserSearchWorkerFormComponent";
import UserWorkforceViewComponent from "./views/dashboard/UserWorkforceViewComponent";
import UserRequestsInProgressComponent from "./views/dashboard/UserRequestsInProgressComponent";
import AdministratorRequestsViewComponent from "./views/administratorDashboard/AdministratorRequestsViewComponent";
import RequestPaidComponent from "./views/dashboard/RequestPaidComponent";
import ServiceProviderRequestPaidComponent from "./views/dashboard/ServiceProviderRequestPaidComponent";
import UserRequestsManagementComponent from "./views/dashboard/UserRequestsManagementComponent";
import ClientManagerComponent from "./views/clientManagerDashboard/ClientManagerComponent";
import ClientManagerRequestViewComponent from "./views/clientManagerDashboard/ClientManagerRequestViewComponent";
import ClientManagerOfferViewComponent from "./views/clientManagerDashboard/ClientManagerOfferViewComponent";
import ClientManagerProfileComponent from "./views/clientManagerDashboard/ClientManagerProfileComponent";
import ClientManagerPaymentComponent from "./views/clientManagerDashboard/ClientManagerPaymentComponent";
import ClientManagerStatisticsComponent from "./views/clientManagerDashboard/ClientManagerStatisticsComponent";
import WorkerRegistrationComponent from "./views/dashboard/registration/WorkerRegistrationComponent";
import UserRegistrationComponent from "./views/dashboard/registration/UserRegistrationComponent";
import AdministratorClientManagerComponent from "./views/administratorDashboard/AdministratorClientManagerComponent";
import UserListComponent from "./views/administratorDashboard/UserListComponent";
import EmployeeListComponent from "./views/administratorDashboard/EmplyeeListComponent";
import UserMyOffersComponent from "./views/dashboard/UserMyOffersComponent";

function App() {
  return <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/prisijungti" component={Login} />
      <Route path="/darbuotojas/prisijungimas" component={WorkerLogin} />
      <PrivateRoute exact path="/pradzia" component={DashboardComponent} />
      <PrivateRoute exact path="/pradzia/profilis" component={UserUnconfirmedProfileComponent} />
      <PrivateRoute exact path="/nepatvirtintas" component={UnconfirmedStatusComponent} />
      <PrivateRoute exact path="/pradzia/darbuotojas" component={WorkerRegistrationComponent} />
      <PrivateRoute exact path="/pradzia/naudotojas" component={UserRegistrationComponent} />
      <PrivateRoute exact path="/administracija" component={AdministratorDashboardComponent} />
      <PrivateRoute exact path="/administracija/profilis" component={AdministratorProfileComponent} />
      <PrivateRoute exact path="/administracija/paslauga" component={AdministratorOfferViewComponent} />
      <PrivateRoute exact path="/administracija/teikejai" component={AdministratorUserManagementComponent} />
      <PrivateRoute exact path="/administracija/naudotojai" component={AdministratorClientManagerComponent} />
      <PrivateRoute exact path="/administracija/darbuotojai" component={AdministratorWorkerManagementComponent} />
      <PrivateRoute exact path="/administracija/darbuotojai/sarasas" component={EmployeeListComponent} />
      <PrivateRoute exact path="/administracija/naudotojai/sarasas" component={UserListComponent} />
      <PrivateRoute exact path="/administracija/mokejimai" component={AdministratorPaymentComponent} />
      <PrivateRoute exact path="/administracija/ataskaitos" component={AdministratorStatisticsComponent} />
      <PrivateRoute exact path="/administracija/pasiulymai" component={AdministratorRequestsViewComponent} />
      <PrivateRoute exact path="/kitas" component={UserProfileViewComponent}/>
      <PrivateRoute exact path="/naudotojas/kitas" component={AdministratorUserViewProfileComponent} />
      <PrivateRoute exact path="/pagrindinis" component={MainUserComponent} />
      <PrivateRoute exact path="/profilis" component={UserProfileComponent} />
      <PrivateRoute exact path="/siulymas" component={UserWorkOfferManagementComponent} />
      <PrivateRoute exact path="/paslauga" component={UserOffersViewComponent} />
      <PrivateRoute exact path="/paslauga/mano" component={UserMyOffersComponent} />
      <PrivateRoute exact path="/mokejimai" component={UserPaymentComponent} />
      <PrivateRoute exact path="/paieska" component={UserWorkforceSearchComponent} />
      <PrivateRoute exact path="/paieska/siulymai" component={UserWorkforceViewComponent} />
      <PrivateRoute exact path="/paieska/kurimas" component={UserSearchWorkerFormComponent} />
      <PrivateRoute exact path="/paieska/valdymas" component={UserRequestsInProgressComponent} />
      <PrivateRoute exact path="/paieska/darbas/mano" component={UserRequestsManagementComponent} />
      <PrivateRoute exact path="/vykdymas" component={UserOffersInProgressComponent} />
      <PrivateRoute exact path="/darbai" component={UserRequestsInProgressComponent} />
      <PrivateRoute exact path="/zinutes" component={UserMessagesComponent} />
      <PrivateRoute exact path="/vykdymas/progresas" component={OfferPaidComponent} />
      <PrivateRoute exact path="/vykdymas/teikejas" component={ServiceProviderOfferPaidComponent} />
      <PrivateRoute exact path="/darbas/vykdymas/progresas" component={RequestPaidComponent} />
      <PrivateRoute exact path="/darbas/vykdymas/teikejas" component={ServiceProviderRequestPaidComponent} />
      <PrivateRoute exact path="/darbuotojas/pagrindinis" component={ClientManagerComponent} />
      <PrivateRoute exact path="/darbuotojas/pasiulymai" component={ClientManagerRequestViewComponent} />
      <PrivateRoute exact path="/darbuotojas/paslauga" component={ClientManagerOfferViewComponent} />
      <PrivateRoute exact path="/darbuotojas/profilis" component={ClientManagerProfileComponent} />
      <PrivateRoute exact path="/darbuotojas/mokejimai" component={ClientManagerPaymentComponent} />
      <PrivateRoute exact path="/darbuotojas/ataskaitos" component={ClientManagerStatisticsComponent} />
    </Switch>
  </Router>
}

export default App;
