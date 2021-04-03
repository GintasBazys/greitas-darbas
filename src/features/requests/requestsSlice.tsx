import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase"

export const requestsSlice = createSlice( {
    name: "requests",
    initialState: {
        requests: Array(0),
        reservedRequest: {}
    },
    reducers: {
        setRequests: (state, action) => {
            state.requests = action.payload;
        },
        setReservedRequest: (state, action) => {
            state.reservedRequest = action.payload;
        }
    }
})

export const {setRequests, setReservedRequest} = requestsSlice.actions;

export const addRequest = (info: { estimatedTime: number; phoneNumber: string; isRemote: boolean; userMail: string; description: string; location: string; title: string; type: string; user: any; userRating: number; username: string; budget: number }) => async (dispatch: any) => {
    await firebase.requestCollection.add({
        user: info.user,
        userMail: info.userMail,
        username: info.username,
        description: info.description,
        phoneNumber: info.phoneNumber,
        type: info.type,
        location: info.location,
        budget: info.budget,
        isRemote: info.isRemote,
        userRating: info.userRating,
        estimatedTime: info.estimatedTime,
        createdOn: new Date().toISOString(),
        status: "naujas",
        title: info.title,
        paymentId: "",
        paymentStatus: "neatliktas",
    }).then(r => {

    }).catch((error) => {
        console.log(error.message)
    })
}

export const updateRequest = (info: { phoneNumber: string; budget: string; isRemote: boolean; description: string; location: string; title: string; previousTitle: any }) => async (dispatch: any) => {
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
                })
            })
        }).catch((error) => {
            console.log(error.message)
        })
}

export const selectReservedRequest = (state: { requests: { reservedRequest: any; }; }) => state.requests.reservedRequest;

export default requestsSlice.reducer;
