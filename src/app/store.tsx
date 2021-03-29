import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import userReducer from  "../features/user/userSlice";
import workerReducer from "../features/worker/workerSlice";
import offersSlice from "../features/offers/offersSlice";
import messagesSlice from "../features/messages/messagesSlice";
import requestsSlice from "../features/requests/requestsSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    worker: workerReducer,
    offers: offersSlice,
    messages: messagesSlice,
    requests: requestsSlice,
  },
  middleware: getDefaultMiddleware({
      serializableCheck: false
  })
});
