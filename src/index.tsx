import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import { BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import {auth, db} from "./firebase";
import history from "./history";
import LoadingComponent from "./views/LoadingComponent";
import {fetchProfilePicture, fetchUserAsync} from "./features/user/userSlice";

auth.onAuthStateChanged( async user => {

    const matchAnyDashboardUrl = history.location.pathname.match(/dashboard/);

    if (user) {
        ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
        await store.dispatch(fetchUserAsync(user));
        await store.dispatch(fetchProfilePicture(user));
        if(matchAnyDashboardUrl === null) {
            history.push("/dashboard");
        }
    }

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById("root")
    );
},)