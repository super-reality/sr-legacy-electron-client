/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, ChatUser, Message } from "../../../types/chat";

const initialState = {
  isChatAuth: false,
  loginData: {} as any,
  activeGroup: {} as Group,
  messages: [] as Message[],
  users: [] as ChatUser[],
  groups: [] as Group[],
};

type ChatState = typeof initialState;

const updateArray = (arrayToChange: any[], newItem: any) => {
  const newItemId = arrayToChange.findIndex(({ _id }) => _id == newItem._id);
  const updatedState = [
    ...arrayToChange.slice(0, newItemId),
    newItem,
    ...arrayToChange.slice(newItemId + 1),
  ];
  return updatedState;
};

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
    setChatLoginData: (state: ChatState, action: PayloadAction<any>): void => {
      state.loginData = action.payload;
    },
    updateUser: (state: ChatState, action: PayloadAction<any>): void => {
      state.loginData.user = action.payload;
    },
    setMessages: (state: ChatState, action: PayloadAction<Message[]>): void => {
      state.messages = action.payload;
    },
    updateMessage: (state: ChatState, action: PayloadAction<Message>): void => {
      state.messages = updateArray(state.messages, action.payload);
    },
    setUsers: (state: ChatState, action: PayloadAction<ChatUser[]>): void => {
      state.users = action.payload;
    },
    updateChatUsers: (
      state: ChatState,
      action: PayloadAction<ChatUser>
    ): void => {
      state.users = updateArray(state.users, action.payload);
    },

    setGroups: (state: ChatState, action: PayloadAction<Group[]>): void => {
      state.groups = action.payload;
    },
    addNewGroup: (state: ChatState, action: PayloadAction<Group>): void => {
      const updatedGroups = state.groups.concat(action.payload);
      state.groups = updatedGroups;
    },
    updateGroup: (state: ChatState, action: PayloadAction<Group>): void => {
      const { groups, activeGroup } = state;
      // const groupId = groups.findIndex(
      //   ({ _id }) => _id == action.payload._id
      // );
      // const updatedCollectives = [
      //   ...collectives.slice(0, collectiveId),
      //   action.payload,
      //   ...collectives.slice(collectiveId + 1),
      // ];
      state.groups = updateArray(groups, action.payload);
      if (activeGroup._id === action.payload._id) {
        state.activeGroup = action.payload;
      }
    },
    deleteGroup: (state: ChatState, action: PayloadAction<Group>): void => {
      const filteredGroups = state.groups.filter(
        ({ _id }) => _id != action.payload._id
      );
      state.groups = filteredGroups;
    },
    setActiveGroup: (state: ChatState, action: PayloadAction<string>): void => {
      const { groups } = state;
      const newActiveGroup = groups.find(({ _id }) => _id === action.payload);
      console.log(newActiveGroup);
      if (newActiveGroup) state.activeGroup = newActiveGroup;
    },
  },
});

export const {
  loginChatSucces,
  loginChatError,
  setChatLoginData,
  updateUser,
  setMessages,
  updateMessage,
  setUsers,
  updateChatUsers,
  setGroups,
  addNewGroup,
  updateGroup,
  deleteGroup,
  setActiveGroup,
} = chatSlice.actions;

export default chatSlice;
