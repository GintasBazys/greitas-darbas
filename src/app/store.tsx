import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import userReducer from  "../features/user/userSlice";
import workerReducer from "../features/worker/workerSlice";
import offersSlice from "../features/offers/offersSlice";
import messagesSlice from "../features/messages/messagesSlice";
import requestsSlice from "../features/requests/requestsSlice";
import offersInProgressFilterSlice from "../features/filter/offersInProgressFilterSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    worker: workerReducer,
    offers: offersSlice,
    messages: messagesSlice,
    requests: requestsSlice,
    offersInProgressFilter: offersInProgressFilterSlice
  },
  middleware: getDefaultMiddleware({
      serializableCheck: false
  })
});
