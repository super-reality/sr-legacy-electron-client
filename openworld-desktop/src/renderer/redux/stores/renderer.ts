import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import renderSlice from "../slices/renderSlice";
import createLessonSlice from "../slices/createLessonSlice";
import createCollectionSlice from "../slices/createCollectionSlice";
import createSubjectSlice from "../slices/createSubjectSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  render: renderSlice.reducer,
  createLesson: createLessonSlice.reducer,
  createCollection: createCollectionSlice.reducer,
  createSubject: createSubjectSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppState = ReturnType<typeof rootReducer>;
