import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppState = ReturnType<typeof rootReducer>;
