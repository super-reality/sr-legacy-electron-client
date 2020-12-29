/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isChatAuth: false,
  loginData: {},
  messages: [] as string[],
  users: [] as string[],
};

type ChatState = typeof initialState;

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loginChatSucces: (state: ChatState, _action: PayloadAction<null>): void => {
      state.isChatAuth = true;
    },
    setChatLoginData: (state: ChatState, action: PayloadAction<{}>): void => {
      state.loginData = action.payload;
    },
    setMessages: (state: ChatState, action: PayloadAction<string[]>): void => {
      state.messages = action.payload;
    },
    setUsers: (state: ChatState, action: PayloadAction<string[]>): void => {
      state.users = action.payload;
    },
  },
});

export const {
  loginChatSucces,
  setChatLoginData,
  setMessages,
  setUsers,
} = chatSlice.actions;

export default chatSlice;
