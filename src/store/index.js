import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterReducer";
import feedbackReducer from "./feedbackSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    feedback: feedbackReducer,
    user: userReducer,
  },
});

export default store;
