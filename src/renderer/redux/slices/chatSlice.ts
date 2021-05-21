/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Group,
  Category,
  ChatUser,
  Message,
  Channel,
  ChannelsResult,
} from "../../../types/chat";

const initialState = {
  isChatAuth: false,
  loginData: {} as any,
  activeGroup: {} as string,
  activeChannel: "" as string,
  messages: [] as Message[],
  users: [] as ChatUser[],
  groups: [] as Group[],
  categories: [] as Category[],
  channels: {
    data: [] as Channel[],
    limit: 100,
    skip: 0,
    total: 0,
  },
};

// {
//   groups:{} as Record<string, Group>,
//   allIds: [] as string[],
//     }
type ChatState = typeof initialState;

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
// delete item from state array

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
      console.log(action.payload);
      state.messages = action.payload;
    },

    addNewMessage: (state: ChatState, action: PayloadAction<Message>): void => {
      state.messages = addNewItem(state.messages, action.payload);
    },
    updateMessage: (state: ChatState, action: PayloadAction<Message>): void => {
      state.messages = updateArray(state.messages, action.payload);
    },
    deleteMessage: (state: ChatState, action: PayloadAction<Message>): void => {
      const filteredMessages = state.messages.filter(
        ({ _id }) => _id != action.payload._id
      );
      state.messages = filteredMessages;
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
    deleteUser: (state: ChatState, action: PayloadAction<Message>): void => {
      const filteredUsers = state.users.filter(
        ({ _id }) => _id != action.payload._id
      );
      state.users = filteredUsers;
    },
    setGroups: (state: ChatState, action: PayloadAction<Group[]>): void => {
      state.groups = action.payload;
    },
    addNewGroup: (state: ChatState, action: PayloadAction<Group>): void => {
      const newGroups = state.groups.concat(action.payload);
      state.groups = newGroups;
    },
    updateGroup: (state: ChatState, action: PayloadAction<Group>): void => {
      const { groups } = state;
      const updatedGroups: Group[] = updateArray(groups, action.payload);
      state.groups = updatedGroups;
    },
    deleteGroup: (state: ChatState, action: PayloadAction<Group>): void => {
      const filteredGroups = state.groups.filter(
        ({ _id }) => _id != action.payload._id
      );
      state.groups = filteredGroups;
    },

    setActiveGroup: (state: ChatState, action: PayloadAction<string>): void => {
      state.activeGroup = action.payload;
    },
    setCategories: (
      state: ChatState,
      action: PayloadAction<Category[]>
    ): void => {
      state.categories = action.payload;
    },
    addNewCategory: (
      state: ChatState,
      action: PayloadAction<Category>
    ): void => {
      const newCategories: Category[] = addNewItem(
        state.categories,
        action.payload
      );
      state.categories = newCategories;
    },
    updateCategory: (
      state: ChatState,
      action: PayloadAction<Category>
    ): void => {
      const updatedCategories: Category[] = updateArray(
        state.categories,
        action.payload
      );
      state.categories = updatedCategories;
    },
    deleteCategory: (state: ChatState, action: PayloadAction<string>): void => {
      const filteredCategories = state.categories.filter(
        ({ _id }) => _id != action.payload
      );

      state.categories = filteredCategories;
    },
    setChannnels: (
      state: ChatState,
      action: PayloadAction<ChannelsResult>
    ): void => {
      state.channels = action.payload;
    },
    updateChannel: (state: ChatState, action: PayloadAction<Channel>): void => {
      const { channels } = state;
      const updatedChannels: Channel[] = updateArray(
        channels.data,
        action.payload
      );
      state.channels.data = updatedChannels;
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
      state.activeChannel = action.payload;
    },
  },
});

export const {
  loginChatSucces,
  loginChatError,
  setChatLoginData,
  updateUser,
  setMessages,
  addNewMessage,
  updateMessage,
  deleteMessage,
  setUsers,
  updateChatUsers,
  deleteUser,
  setGroups,
  addNewGroup,
  updateGroup,
  deleteGroup,
  setActiveGroup,
  setCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
  setChannnels,
  updateChannel,
  deleteChannel,
  addNewChannel,
  setActiveChannel,
} = chatSlice.actions;

export default chatSlice;
