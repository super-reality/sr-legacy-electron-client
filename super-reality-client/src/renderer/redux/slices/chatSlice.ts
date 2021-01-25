/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Group,
  ChatUser,
  Message,
  Channel,
  ChannelsResult,
} from "../../../types/chat";

const initialState = {
  isChatAuth: false,
  loginData: {} as any,
  activeGroup: {} as Group,
  activeCannnel: {} as Channel,
  messages: [] as Message[],
  users: [] as ChatUser[],
  groups: [] as Group[],
  channels: {
    data: [] as Channel[],
    limit: 100,
    skip: 0,
    total: 0,
  },
};

type ChatState = typeof initialState;
// type StateArray = Group[] | Message[]| ChatUser[]|Channel[];

const updateArray = (arrayToChange: any, newItem: any) => {
  const newItemId = arrayToChange.findIndex(
    ({ _id }: any) => _id == newItem._id
  );
  const updatedState = [
    ...arrayToChange.slice(0, newItemId),
    newItem,
    ...arrayToChange.slice(newItemId + 1),
  ];
  return updatedState;
};

// add new item to state array
const addNewItem = (stateArray: any, newItem: any) =>
  stateArray.concat(newItem);

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
      const updatedGroups: Group[] = updateArray(groups, action.payload);
      state.groups = updatedGroups;
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
    setChannnels: (
      state: ChatState,
      action: PayloadAction<ChannelsResult>
    ): void => {
      state.channels = action.payload;
    },
    updateChannel: (state: ChatState, action: PayloadAction<Channel>): void => {
      const { channels, activeCannnel } = state;
      const updatedChannels: Channel[] = updateArray(
        channels.data,
        action.payload
      );
      state.channels.data = updatedChannels;
      if (activeCannnel._id === action.payload._id) {
        state.activeCannnel = action.payload;
      }
    },
    deleteChannel: (state: ChatState, action: PayloadAction<Channel>): void => {
      const filteredChannels = state.channels.data.filter(
        ({ _id }) => _id != action.payload._id
      );
      state.channels.data = filteredChannels;
    },
    addNewChannel: (state: ChatState, action: PayloadAction<Channel>): void => {
      state.channels.data = addNewItem(state.channels.data, action.payload);
    },
    setActiveChannel: (
      state: ChatState,
      action: PayloadAction<string>
    ): void => {
      const { channels } = state;
      const newActiveChannel = channels.data.find(
        ({ _id }) => _id === action.payload
      );
      console.log(newActiveChannel);
      if (newActiveChannel) state.activeCannnel = newActiveChannel;
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
  setChannnels,
  updateChannel,
  deleteChannel,
  addNewChannel,
  setActiveChannel,
} = chatSlice.actions;

export default chatSlice;
