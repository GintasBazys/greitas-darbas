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
import firebase from "firebase";

auth.onAuthStateChanged( async user => {

    //const matchAnyDashboardUrl = history.location.pathname.match(/pradzia/);

    let userStatus = "";

    if (user) {
        await db.collection("users").doc(user.uid).get()
            .then((doc) => {
                userStatus =doc.data()?.status;
            })
        console.log(userStatus);
        if(userStatus === "naujas") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchUserAsync(user));
            await store.dispatch(fetchProfilePicture(user));
            history.push("/pradzia");
        }

        if(userStatus === "nepatvirtintas") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchUserAsync(user));
            await store.dispatch(fetchProfilePicture(user));
            history.push("/nepatvirtintas");
        }

        if(userStatus === "patvirtintas") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchUserAsync(user));
            await store.dispatch(fetchProfilePicture(user));
            history.push("/pagrindinis");
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