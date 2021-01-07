/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isChatAuth: false,
  loginData: {} as Record<string, unknown>,
  messages: [] as any[],
  users: [] as any[],
};

type ChatState = typeof initialState;

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    loginChatSucces: (state: ChatState, _action: PayloadAction<null>): void => {
      state.isChatAuth = true;
    },
    loginChatError: (state: ChatState, _action: PayloadAction<null>): void => {
      state.isChatAuth = false;
    },
    setChatLoginData: (
      state: ChatState,
      action: PayloadAction<Record<string, unknown>>
    ): void => {
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
  loginChatError,
  setChatLoginData,
  setMessages,
  setUsers,
} = chatSlice.actions;

export default chatSlice;
