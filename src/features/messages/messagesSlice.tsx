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


export const {setMessages} = messagesSlice.actions;

export default messagesSlice.reducer;