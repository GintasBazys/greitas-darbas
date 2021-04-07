import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase";
import {auth, db} from "../../firebase";
import defaultAvatar from "../../assets/avatar.png";
import history from "../../history";

export const userSlice = createSlice( {
    name: "user",
    initialState: {
        userProfile: {
            name: auth.currentUser,
            image: auth.currentUser,
            checkedRemember: true,
            email: auth.currentUser
        },
        errorMessage: ""
    },
    reducers: {
        changeRemember: (state, action) => {
            state.userProfile.checkedRemember = action.payload;
        },
        signIn: (state, action) => {
            state.userProfile.name = action.payload.username
            state.userProfile.checkedRemember = action.payload.checkedRemember;
            state.userProfile.email = action.payload.email;
        },
        sendError: (state, action) => {
            state.errorMessage = action.payload;
        },
        fetchUser: (state, action) => {
            state.userProfile.name = action.payload.username;
            state.userProfile.email = action.payload.email;
        },
        setEmptyProfile: (state) => {
            state.userProfile.name = null;
            state.userProfile.checkedRemember = true;
            state.userProfile.email = null;
        },
        fetchPicture: (state, action) => {
            state.userProfile.image = action.payload;
        },
        fetchEmail: (state, action) => {
            state.userProfile.email = action.payload
        }
    }
})

export const {signIn, sendError, changeRemember, fetchUser, setEmptyProfile, fetchPicture, fetchEmail} = userSlice.actions;

export const signUpAsync  = (info: { username: string; email: string; password: string;}) => (dispatch: (arg0: { payload: any; type: string; }) => void) => {

    firebase.auth.createUserWithEmailAndPassword(
        info.email,
        info.password
    ).then((user) => {
        firebase.usersCollection.doc(user?.user?.uid).set({
            username: info.username,
            email: info.email,
            status: "naujas",
            aboutMe: "Įveskite informacijos apie save...",
            image: defaultAvatar,
            portfolioImages: [],
            rating: 0,
            ratingCount: 0,
            allRating: 0
        })
            .then(() => {
                console.log("Document successfully written!");
                history.go(0);
            })
    })
        .catch((error) => {
            dispatch(sendError(error.message))//TODO pakeisti klaidos pranesima
            setTimeout(() => {
                dispatch(sendError(""))
            }, 5000)
            console.error("Error writing document: ", error.message);
        });

}

export const loginAsync = (info: { email: string; password: string; checkedRemember: boolean; }) => (dispatch: (arg0: { payload: any; type: string; }) => void) => {
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
        firebase.usersCollection.doc(user?.user?.uid).get().then((userProfile => {
            dispatch(signIn(userProfile.data()));
        }))
    }).catch((error) => {
        console.log(error.message)
    });
}

export const fetchUserAsync = (user: { uid: string | undefined }) => async (dispatch: (arg0: { payload: any; type: string; }) => any) => {
    const userProfile = await firebase.usersCollection.doc(user.uid).get()

    await dispatch(fetchUser(userProfile.data()))
}

//nuotraukos pakeitimui
export const fetchPictureAsync = (image: string) => async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
    await firebase.usersCollection.doc(auth.currentUser?.uid).set({
        image: image
    }, {merge: true});
    const userRef = firebase.usersCollection.doc(auth.currentUser?.uid);
    userRef.get().then(doc => {
        //console.log(doc.data()?.image)
        dispatch(fetchPicture(doc.data()?.image))
    }).catch((error) => {
        dispatch(sendError(error.message));
        setTimeout(() => {
            dispatch(sendError(""))
        }, 5000)
        console.log(error.message);
    })

}

export const fetchUpdateUserStatusToReview = (p: { date: Date; experienceLevel: string; phoneNumber: string; activity: string; nameAndSurname: string; photo: any; location: string; user: any }) => async (dispatch: (arg0: { payload: object; type: string; }) => void) => {

    await db.collection("users").doc(p.user).update({
        status: "nepatvirtintas",
        dateOfBirth: p.date,
        nameAndSurname: p.nameAndSurname,
        experienceLevel: p.experienceLevel,
        activity: p.activity,
        phoneNumber: p.phoneNumber,
        location: p.location,
        image: p.photo
    }).catch((error) => {
        console.log(error);
    })
}

export const fetchUpdateClientStatusToReview = (p: { date: Date; phoneNumber: string; nameAndSurname: string; photo: any; location: string; user: any }) => async (dispatch: (arg0: { payload: object; type: string; }) => void) => {

    await db.collection("users").doc(p.user).update({
        status: "nepatvirtintas",
        dateOfBirth: p.date,
        nameAndSurname: p.nameAndSurname,
        phoneNumber: p.phoneNumber,
        location: p.location,
        image: p.photo
    }).catch((error) => {
        console.log(error);
    })
}

export const fetchUpdateUserWorkPicturesToReview = (p: {user: any, portfolioImages: Array<any>}) => async () => {
    await db.collection("users").doc(p.user.uid).update({
        portfolioImages: p.portfolioImages
    })
}

export const fetchProfilePicture = (user: any) => (dispatch: (arg0: { payload: object; type: string; }) => void) => {
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



export const selectCheckedUser = (state: { user: { userProfile: {checkedRemember: boolean}; }; }) => state.user.userProfile.checkedRemember;
export  const selectError = (state: { user: { errorMessage: string; }; }) => state.user.errorMessage;
export const selectImage = (state: { user: { userProfile: { image: string; }; }; }) => state.user.userProfile.image;
export const selectUser = (state: {user: {userProfile: {name: string};}; }) => state.user.userProfile.name;
export const selectUserEmail = (state: {user: {userProfile: {email: string};}; }) => state.user.userProfile.email;

export default userSlice.reducer;