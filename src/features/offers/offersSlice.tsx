import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase"

export const offersSlice = createSlice( {
    name: "offers",
    initialState: {
        offers: Array(0),
        reservedOffer: {},
        offer: {}
    },
    reducers: {
        setOffers: (state, action) => {
            state.offers = action.payload;
        },
        setReservedOffer: (state, action) => {
            state.reservedOffer = action.payload;
        },
        setOffer: (state, action) => {
            state.offer = action.payload
        }
    }
})

export const addOffer = (info: { activity: string; isRemote: boolean; description: string; profileImage: string; title: string; userRating: number; phoneNumber: string; experienceLevel: string; price: string; nameAndSurname: string; userMail: string; offerImages: Array<string>; location: string; user: string | undefined; username: string }) => async (dispatch: any) => {
    await firebase.offersCollection.add({
        user: info.user,
        userMail: info.userMail,
        username: info.username,
        description: info.description,
        phoneNumber: info.phoneNumber,
        location: info.location,
        price: info.price,
        isRemote: info.isRemote,
        userRating: info.userRating,
        createdOn: new Date().toISOString(),
        status: "naujas",
        title: info.title,
        offerImages: info.offerImages,
        activity: info.activity,
        experienceLevel: info.experienceLevel,
        nameAndSurname: info.nameAndSurname,
        profileImage: info.profileImage
    }).then(r => {

    }).catch((error) => {
        console.log(error.message)
    })

}

export const updateOffer = (info: { phoneNumber: string; price: string; isRemote: boolean; description: string; location: string; title: string; previousTitle: any }) => async (dispatch: any) => {
    await firebase.offersCollection.where("title", "==", info.previousTitle).limit(1).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                firebase.offersCollection.doc(doc.id).update({
                    description: info.description,
                    phoneNumber: info.phoneNumber,
                    location: info.location,
                    price: info.price,
                    isRemote: info.isRemote,
                    title: info.title,
                })
            })
        }).catch((error) => {
            console.log(error.message)
        })
}


export const updateOffers = (info: {mail: string}) => async (dispatch: any) => {
    await firebase.offersCollection.where("userMail", "==", info.mail).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                firebase.offersCollection.doc(doc.id).update({
                    userMail: info.mail
                })
            })
        })
}

export const updateOffersUsername = (info: {username: string, usernameBeforeChange: string}) => async (dispatch: any) => {
    await firebase.offersCollection.where("username", "==", info.usernameBeforeChange).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                firebase.offersCollection.doc(doc.id).update({
                    username: info.username
                })
            })
        })
}

export const {setOffers, setReservedOffer, setOffer} = offersSlice.actions;

export const selectReservedOffer = (state: { offers: { reservedOffer: any; }; }) => state.offers.reservedOffer;
export const selectOffer = (state: { offers: {offer: any; }; }) => state.offers.offer;

export default offersSlice.reducer;