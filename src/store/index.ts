import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import peopleReducer from "./slices/peopleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    people: peopleReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
