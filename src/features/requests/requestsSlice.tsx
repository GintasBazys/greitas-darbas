import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase"

export const requestsSlice = createSlice( {
    name: "requests",
    initialState: {
        requests: Array(0),
        reservedRequest: {},
        request: {}
    },
    reducers: {
        setRequests: (state, action) => {
            state.requests = action.payload;
        },
        setReservedRequest: (state, action) => {
            state.reservedRequest = action.payload;
        },
        setRequest: (state, action) => {
            state.request = action.payload;
        },
    }
})

export const {setRequests, setReservedRequest, setRequest} = requestsSlice.actions;

export const addRequest = (info: { address: string; activity: string; isRemote: boolean; description: string; profileImage: string; title: string; reservedUserEmail: string; userRating: number; reservedUser: string; reservedUserNameAndSurname: string; phoneNumber: string; nameAndSurname: string; userMail: string; reservedUserPhoneNumber: string; location: string; term: string; user: string | undefined; paymentStatus: string; username: string; budget: number }) => async (dispatch: any) => {
    await firebase.requestCollection.add({
        user: info.user,
        userMail: info.userMail,
        username: info.username,
        description: info.description,
        phoneNumber: info.phoneNumber,
        location: info.location,
        budget: info.budget,
        isRemote: info.isRemote,
        userRating: info.userRating,
        createdOn: new Date().toISOString(),
        status: "naujas",
        title: info.title,
        profileImage: info.profileImage,
        term: info.term,
        nameAndSurname: info.nameAndSurname,
        address: info.address,
        activity: info.activity,
        reservedUserNameAndSurname: info.reservedUserNameAndSurname,
        reservedUserPhoneNumber: info.reservedUserPhoneNumber,
        paymentStatus: info.paymentStatus,
        reservedUser: info.reservedUser,
        reservedUserEmail: info.reservedUserEmail
    }).then(r => {

    }).catch((error) => {
        console.log(error.message)
    })
}

export const updateRequests = (info: {mail: string}) => async (dispatch: any) => {
    await firebase.requestCollection.where("userMail", "==", info.mail).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                firebase.requestCollection.doc(doc.id).update({
                    userMail: info.mail
                })
            })
        })
}

export const updateRequestsUsername = (info: {username: string, usernameBeforeChange: string}) => async (dispatch: any) => {
    await firebase.requestCollection.where("username", "==", info.usernameBeforeChange).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                firebase.requestCollection.doc(doc.id).update({
                    username: info.username
                })
            })
        })
}

export const updateRequest = (info: {date: string; address: string; activity: string; phoneNumber: string; budget: string; isRemote: boolean; description: string; location: string; title: string; previousTitle: any }) => async (dispatch: any) => {
    await firebase.requestCollection.where("title", "==", info.previousTitle).limit(1).get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
               await firebase.requestCollection.doc(doc.id).update({
                    description: info.description,
                    phoneNumber: info.phoneNumber,
                    location: info.location,
                    budget: info.budget,
                    isRemote: info.isRemote,
                    title: info.title,
                    activity: info.activity,
                    address: info.activity,
                    date: info.date
                })
            })
        }).catch((error) => {
            console.log(error.message)
        })
}

export const selectReservedRequest = (state: { requests: { reservedRequest: any; }; }) => state.requests.reservedRequest;
export const selectRequest = (state: { requests: { request: any; }; }) => state.requests.request;

export default requestsSlice.reducer;
