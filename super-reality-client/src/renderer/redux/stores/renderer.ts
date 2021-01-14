import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import renderSlice from "../slices/renderSlice";
import backgroundSlice from "../slices/backgroundSlice";
import createCollectionSlice from "../slices/createCollectionSlice";
import createSubjectSlice from "../slices/createSubjectSlice";
import createLessonSliceV2 from "../slices/createLessonSliceV2";
import commonPropSlice from "../slices/commonPropSlice";
import userDataSlice from "../slices/userDataSlice";
import settingsSlice from "../slices/settingsSlice";
import lessonPlayerSlice from "../slices/lessonPlayerSlice";
import chatSlice from "../slices/chatSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  render: renderSlice.reducer,
  background: backgroundSlice.reducer,
  createCollection: createCollectionSlice.reducer,
  createSubject: createSubjectSlice.reducer,
  createLessonV2: createLessonSliceV2.reducer,
  commonProps: commonPropSlice.reducer,
  userData: userDataSlice.reducer,
  settings: settingsSlice.reducer,
  lessonPlayer: lessonPlayerSlice.reducer,
  chat: chatSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppState = ReturnType<typeof rootReducer>;
