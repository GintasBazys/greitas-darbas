import {createSlice} from "@reduxjs/toolkit";
import * as firebase from "../../firebase"
import history from "../../history";

export const messagesSlice = createSlice( {
    name: "messages",
    initialState: {
        messages: Array(0),
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        }
    }
})

export const createMessage = (info: {email: string, username: string, user: string, message: string, sender: string | undefined}) => async (dispatch: any) => {

    await firebase.messagesCollection.where("user", "==", info.user).limit(1).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(!querySnapshot.empty) {
                    let messagesArray = doc.data()?.messages
                    messagesArray = [info.message, ...messagesArray];
                    // @ts-ignore
                    firebase.messagesCollection.doc(doc.id).set({
                        messages: messagesArray
                    }, {merge: true}).then(() => {
                        history.go(0);
                    })
                    //
                } else {
                    firebase.messagesCollection.add({
                        messages: [info.message],
                        email: info.email,
                        user: info.user,
                        username: info.username,
                        sender: info.sender
                    }).then(() => {
                        history.go(0);
                    })
                    //history.go(0);
                }
            })

        })


}

export const {setMessages} = messagesSlice.actions;

export default messagesSlice.reducer;