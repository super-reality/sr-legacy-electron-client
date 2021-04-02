import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import renderSlice from "../slices/renderSlice";
import backgroundSlice from "../slices/backgroundSlice";
import createLessonSliceV2 from "../slices/createLessonSliceV2";
import commonPropSlice from "../slices/commonPropSlice";
import userDataSlice from "../slices/userDataSlice";
import settingsSlice from "../slices/settingsSlice";
import lessonPlayerSlice from "../slices/lessonPlayerSlice";
import chatSlice from "../slices/chatSlice";
import createSupportTicketSlice from "../slices/createSupportTicketSlice";
import sidebarSlice from "../slices/sidebarSlice";
import reducers from "../slices/xrengine/reducers";

const combinedReducer = combineReducers({
  auth: authSlice.reducer,
  render: renderSlice.reducer,
  background: backgroundSlice.reducer,
  createLessonV2: createLessonSliceV2.reducer,
  commonProps: commonPropSlice.reducer,
  userData: userDataSlice.reducer,
  settings: settingsSlice.reducer,
  lessonPlayer: lessonPlayerSlice.reducer,
  chat: chatSlice.reducer,
  createSupportTicket: createSupportTicketSlice.reducer,
  sidebar: sidebarSlice.reducer,
  xrengine: reducers,
});

type RootReducerType = typeof combinedReducer;

const rootReducer: RootReducerType = (state, action) => {
  if (action.type === "userData/reset") {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type AppState = ReturnType<typeof combinedReducer>;
