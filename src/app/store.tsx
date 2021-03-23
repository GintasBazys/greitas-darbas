import { configureStore } from '@reduxjs/toolkit';
import userReducer from  "../features/user/userSlice";
import workerReducer from "../features/worker/workerSlice";
import offersSlice from "../features/offers/offersSlice";
import messagesSlice from "../features/messages/messagesSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    worker: workerReducer,
    offers: offersSlice,
    messages: messagesSlice
  },
});
