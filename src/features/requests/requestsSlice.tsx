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
            state.requests = action.payload;
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

export default requestsSlice.reducer;
