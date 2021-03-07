import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase"

export const offersSlice = createSlice( {
    name: "offers",
    initialState: {
        offers: Array(0),
    },
    reducers: {
        setOffers: (state, action) => {
            state.offers = action.payload;
        }
    }
})

export const addOffer = (info: {
    user: any,
    userMail: string,
    username: string,
    activityType: string,
    description: string,
    phoneNumber: string,
    location: string,
    price: string,
    isRemote: boolean,
    userRating: number}) => async (dispatch: (arg0: { payload: object; type: string; }) => void) => {
    await firebase.offersCollection.add({
        user: info.user,
        userMail: info.userMail,
        username: info.username,
        activityType: info.activityType,
        description: info.description,
        phoneNumber: info.phoneNumber,
        location: info.location,
        price: info.price,
        isRemote: info.isRemote,
        userRating: info.userRating,
        createdOn: new Date().toISOString()
    }).then(r => {

    }).catch((error) => {
        console.log(error.message)
    })

}
export const {setOffers} = offersSlice.actions;

export default offersSlice.reducer;