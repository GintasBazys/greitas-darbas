import { configureStore } from '@reduxjs/toolkit';
import userReducer from  "../features/user/userSlice";
import workerReducer from "../features/worker/workerSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    worker: workerReducer
  },
});
