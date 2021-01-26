import React from 'react';
import history from "./history";
import {Switch, Route, Router} from "react-router-dom";
import HomeComponent from "./views/HomeComponent";
import PrivateRoute from "./PrivateRoute";

function App() {
  return <Router history={history}>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <PrivateRoute exact path="/login" component={HomeComponent} />
    </Switch>
  </Router>
}

export default App;
