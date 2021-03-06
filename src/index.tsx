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
import {fetchWorkerAsync, fetchWorkerProfilePicture} from "./features/worker/workerSlice";

auth.onAuthStateChanged( async user => {

    let userStatus = "";
    let workerStatus = "";

    if (user) {
        await db.collection("users").doc(user.uid).get()
            .then((doc) => {
                userStatus =doc.data()?.status;
            })

        await db.collection("workers").doc(user.uid).get()
            .then((doc) => {
                workerStatus = doc.data()?.status;
            })

        if(workerStatus === "administratorius") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchWorkerAsync(user));
            await store.dispatch(fetchWorkerProfilePicture(user));
            history.push("/administracija");
        }

        if(workerStatus === "darbuotojas") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchWorkerAsync(user));
            await store.dispatch(fetchWorkerProfilePicture(user));
            history.push("/darbuotojas/pagrindinis");
        }

        if(userStatus === "naujas") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchUserAsync(user));
            await store.dispatch(fetchProfilePicture(user));
            history.push("/pradzia");
        }

        if(userStatus === "nepatvirtintas_darbuotojas" || userStatus === "nepatvirtintas_naudotojas") {
            ReactDOM.render(<LoadingComponent/>, document.getElementById("root"));
            await store.dispatch(fetchUserAsync(user));
            await store.dispatch(fetchProfilePicture(user));
            history.push("/nepatvirtintas");
        }

        if(userStatus === "patvirtintas_darbuotojas" || userStatus === "patvirtintas_naudotojas" ) {
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