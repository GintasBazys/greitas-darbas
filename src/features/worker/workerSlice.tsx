import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase";
import {auth, db, secondaryApp} from "../../firebase";
import defaultAvatar from "../../assets/avatar.png";
import history from "../../history";

export const workerSlice = createSlice( {
    name: "worker",
    initialState: {
        workerProfile: {
            name: auth.currentUser,
            image: auth.currentUser,
            email: auth.currentUser,
            checkedWorkerRemember: true
        },
        workerErrorMessage: ""
    },
    reducers: {
        changeWorkerRemember: (state, action) => {
            state.workerProfile.checkedWorkerRemember = action.payload;
        },
        signIn: (state, action) => {
            state.workerProfile.name = action.payload.username;
            state.workerProfile.checkedWorkerRemember = action.payload.checkedRemember;
            state.workerProfile.email = action.payload.email;
        },
        sendWorkerError: (state, action) => {
            state.workerErrorMessage = action.payload;
        },
        fetchUser: (state, action) => {
            state.workerProfile.name = action.payload.username;
            state.workerProfile.email = action.payload.email;
        },
        setEmptyProfile: (state) => {
            state.workerProfile.name = null;
            state.workerProfile.checkedWorkerRemember = true;
            state.workerProfile.email = null;
        },
        fetchPicture: (state, action) => {
            state.workerProfile.image = action.payload;
        }
    }
})

export const {signIn, sendWorkerError, changeWorkerRemember, fetchUser, setEmptyProfile, fetchPicture} = workerSlice.actions;

export const loginWorkerAsync = (info: { email: string; password: string; checkedRemember: boolean; }) => (dispatch: (arg0: { payload: object; type: string; }) => void) => {
    if(!info.checkedRemember) {
        firebase.auth.setPersistence(firebase.Auth.Persistence.SESSION)
            .then(() => {
                return firebase.auth.signInWithEmailAndPassword(info.email, info.password);
            })
            .catch(function(error) {
                console.log(error.message)
            });

    } else if(info.checkedRemember){
        firebase.auth.setPersistence(firebase.Auth.Persistence.LOCAL)
            .then(() => {
                return firebase.auth.signInWithEmailAndPassword(info.email, info.password);
            })
            .catch(function(error) {
                console.log(error.message)
            });
    }

    firebase.auth.signInWithEmailAndPassword(
        info.email,
        info.password
    ).then((user) => {
        firebase.workerCollection.doc(user?.user?.uid).get().then((userProfile => {
            dispatch(signIn(userProfile.data()));
        }))
    }).catch((error) => {
        console.log(error.message)
    });
}

export const fetchWorkerAsync = (user: { uid: string | undefined }) => async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
    const userProfile = await firebase.workerCollection.doc(user.uid).get()

    await dispatch(fetchUser(userProfile.data()))
}

//nuotraukos pakeitimui
export const fetchWorkerPictureAsync = (image: string) => async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
    await firebase.workerCollection.doc(auth.currentUser?.uid).set({
        image: image
    }, {merge: true});
    const userRef = firebase.workerCollection.doc(auth.currentUser?.uid);
    userRef.get().then(doc => {
        //console.log(doc.data()?.image)
        dispatch(fetchPicture(doc.data()?.image))
    }).catch((error) => {
        dispatch(sendWorkerError(error.message));
        setTimeout(() => {
            dispatch(sendWorkerError(""))
        }, 5000)
        console.log(error.message);
    })

}

export const fetchWorkerProfilePicture = (user: any) => (dispatch: (arg0: { payload: object; type: string; }) => void) => {
    const userRef = db.collection("users").doc(user.uid);
    userRef
        .get()
        .then(doc => {
            if(doc.data()?.image === undefined) {
                dispatch(fetchPicture(defaultAvatar))
            } else {
                dispatch(fetchPicture(doc.data()?.image))
            }

        }).catch((error) => {
        console.log(error);
    })
}

export const logout = () => (dispatch: (arg0: { payload: undefined; type: string; }) => void) => {
    firebase.auth.signOut()
        .then(() => {
            history.push("/");
            dispatch(setEmptyProfile())
        }).catch(error => {
        console.log(error)
    })
}

export const signUpWorkerAsync  = (info: { username: string; email: string; password: string;}) => (dispatch: (arg0: { payload: object; type: string; }) => void) => {

    secondaryApp.auth().createUserWithEmailAndPassword(
        info.email,
        info.password
    ).then((user) => {
        firebase.workerCollection.doc(user?.user?.uid).set({
            username: info.username,
            email: info.email,
            status: "darbuotojas",
            createdOn: new Date().toISOString()
        })
            .then(() => {
                console.log("Document successfully written!");
            })
    })
        .catch((error) => {
            dispatch(sendWorkerError(error.message))
            setTimeout(() => {
                dispatch(sendWorkerError(""))
            }, 5000)
            console.error("Error writing document: ", error.message);
        });

}

export const selectCheckedWorker = (state: { worker: { workerProfile: {checkedWorkerRemember: boolean}; }; }) => state.worker.workerProfile.checkedWorkerRemember;
export  const selectWorkerError = (state: any) => state.worker.workerErrorMessage;
export const selectWorkerImage = (state: { worker: { workerProfile: { image: string; }; }; }) => state.worker.workerProfile.image;
export const selectWorker = (state: {worker: {workerProfile: {name: string};}; }) => state.worker.workerProfile.name;
export const selectWorkerEmail = (state: {worker: {workerProfile: {email: string};}; }) => state.worker.workerProfile.email;

export default workerSlice.reducer;